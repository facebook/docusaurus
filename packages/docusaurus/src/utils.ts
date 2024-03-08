/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import logger from '@docusaurus/logger';

// For now this is a private env variable we use internally
// But we'll want to expose this feature officially some day
export const PerfDebuggingEnabled: boolean =
  !!process.env.DOCUSAURUS_PERF_LOGGER;

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

  const prefix = logger.yellow(`[PERF] `);

  const start: PerfLoggerAPI['start'] = (label) => console.time(prefix + label);

  const end: PerfLoggerAPI['end'] = (label) => console.timeEnd(prefix + label);

  const log: PerfLoggerAPI['log'] = (label: string) =>
    console.log(prefix + label);

  const async: PerfLoggerAPI['async'] = async (label, asyncFn) => {
    start(label);
    const result = await asyncFn();
    end(label);
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
