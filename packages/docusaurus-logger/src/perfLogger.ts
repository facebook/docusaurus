/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {AsyncLocalStorage} from 'async_hooks';
import logger from './logger';

// For now this is a private env variable we use internally
// But we'll want to expose this feature officially some day
const PerfDebuggingEnabled: boolean = !!process.env.DOCUSAURUS_PERF_LOGGER;

const Thresholds = {
  min: 5,
  yellow: 100,
  red: 1000,
};

const PerfPrefix = logger.yellow(`[PERF] `);

// This is what enables to "see the parent stack" for each log
// Parent1 > Parent2 > Parent3 > child trace
const ParentPrefix = new AsyncLocalStorage<string>();
function applyParentPrefix(label: string) {
  const parentPrefix = ParentPrefix.getStore();
  return parentPrefix ? `${parentPrefix} > ${label}` : label;
}

type PerfLoggerAPI = {
  start: (label: string) => void;
  end: (label: string) => void;
  log: (message: string) => void;
  async: <Result>(
    label: string,
    asyncFn: () => Result | Promise<Result>,
  ) => Promise<Result>;
};

type Memory = {
  before: NodeJS.MemoryUsage;
  after: NodeJS.MemoryUsage;
};

function createPerfLogger(): PerfLoggerAPI {
  if (!PerfDebuggingEnabled) {
    const noop = () => {};
    return {
      start: noop,
      end: noop,
      log: noop,
      async: async (_label, asyncFn) => asyncFn(),
    };
  }

  const formatDuration = (duration: number): string => {
    if (duration > Thresholds.red) {
      return logger.red(`${(duration / 1000).toFixed(2)} seconds!`);
    } else if (duration > Thresholds.yellow) {
      return logger.yellow(`${duration.toFixed(2)} ms`);
    } else {
      return logger.green(`${duration.toFixed(2)} ms`);
    }
  };

  const formatMemory = (memory: Memory): string => {
    const fmtHead = (bytes: number) =>
      logger.cyan(`${(bytes / 1000000).toFixed(0)}mb`);
    return logger.dim(
      `(${fmtHead(memory.before.heapUsed)} -> ${fmtHead(
        memory.after.heapUsed,
      )})`,
    );
  };

  const printPerfLog = ({
    label,
    duration,
    memory,
  }: {
    label: string;
    duration: number;
    memory: Memory;
  }) => {
    if (duration < Thresholds.min) {
      return;
    }
    console.log(
      `${PerfPrefix + label} - ${formatDuration(duration)} - ${formatMemory(
        memory,
      )}`,
    );
  };

  const start: PerfLoggerAPI['start'] = (label) =>
    performance.mark(label, {
      detail: {
        memoryUsage: process.memoryUsage(),
      },
    });

  const end: PerfLoggerAPI['end'] = (label) => {
    const {
      duration,
      detail: {memoryUsage},
    } = performance.measure(label);
    performance.clearMarks(label);
    printPerfLog({
      label: applyParentPrefix(label),
      duration,
      memory: {
        before: memoryUsage,
        after: process.memoryUsage(),
      },
    });
  };

  const log: PerfLoggerAPI['log'] = (label: string) =>
    console.log(PerfPrefix + applyParentPrefix(label));

  const async: PerfLoggerAPI['async'] = async (label, asyncFn) => {
    const finalLabel = applyParentPrefix(label);
    const before = performance.now();
    const memoryBefore = process.memoryUsage();
    const result = await ParentPrefix.run(finalLabel, () => asyncFn());
    const memoryAfter = process.memoryUsage();
    const duration = performance.now() - before;
    printPerfLog({
      label: finalLabel,
      duration,
      memory: {
        before: memoryBefore,
        after: memoryAfter,
      },
    });
    return result;
  };

  return {
    start,
    end,
    log,
    async,
  };
}

export const PerfLogger: PerfLoggerAPI = createPerfLogger();
