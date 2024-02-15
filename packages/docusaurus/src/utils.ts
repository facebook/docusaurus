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
};

function createPerfLogger(): PerfLoggerAPI {
  if (!PerfDebuggingEnabled) {
    const noop = () => {};
    return {
      start: noop,
      end: noop,
      log: noop,
    };
  }

  const prefix = logger.yellow(`[PERF] `);
  return {
    start: (label) => console.time(prefix + label),
    end: (label) => console.timeEnd(prefix + label),
    log: (label) => console.log(prefix + label),
  };
}

export const PerfLogger: PerfLoggerAPI = createPerfLogger();
