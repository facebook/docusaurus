/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {AsyncLocalStorage} from 'async_hooks';
import logger from '@docusaurus/logger';

// For now this is a private env variable we use internally
// But we'll want to expose this feature officially some day
export const PerfDebuggingEnabled: boolean =
  !!process.env.DOCUSAURUS_PERF_LOGGER;

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

  const logDuration = (label: string, duration: number) => {
    if (duration < Thresholds.min) {
      return;
    }
    console.log(`${PerfPrefix + label} - ${formatDuration(duration)}`);
  };

  const start: PerfLoggerAPI['start'] = (label) => performance.mark(label);

  const end: PerfLoggerAPI['end'] = (label) => {
    const {duration} = performance.measure(label);
    performance.clearMarks(label);
    logDuration(applyParentPrefix(label), duration);
  };

  const log: PerfLoggerAPI['log'] = (label: string) =>
    console.log(PerfPrefix + applyParentPrefix(label));

  const async: PerfLoggerAPI['async'] = async (label, asyncFn) => {
    const finalLabel = applyParentPrefix(label);
    const before = performance.now();
    const result = await ParentPrefix.run(finalLabel, () => asyncFn());
    const duration = performance.now() - before;
    logDuration(finalLabel, duration);
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
