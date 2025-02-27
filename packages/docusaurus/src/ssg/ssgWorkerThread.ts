/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {workerData} from 'node:worker_threads';
import logger, {PerfLogger} from '@docusaurus/logger';
import {loadSSGRenderer, type SSGResult} from './ssgRenderer.js';
import type {SSGParams} from './ssgParams.js';

// eslint-disable-next-line no-underscore-dangle
const workerId = process?.__tinypool_state__?.workerId;
if (!workerId) {
  throw new Error('SSG Worker Thread not executing in Tinypool context?');
}

const params: SSGParams = workerData?.[1]?.params;
if (!params) {
  throw new Error(`SSG Worker Thread workerData params missing`);
}

const WorkerLogPrefix = `SSG Worker ${logger.name(workerId)}`;

// We only load once the SSG rendered (expensive), NOT once per worker task
// TODO check potential memory leak?
const appRendererPromise = PerfLogger.async(
  `${WorkerLogPrefix} - Initialization`,
  () =>
    loadSSGRenderer({
      params,
    }),
);

export type SSGWorkerThreadTask = {
  id: number;
  pathnames: string[];
};

export default async function executeSSGWorkerThreadTask(
  task: SSGWorkerThreadTask,
): Promise<SSGResult[]> {
  const appRenderer = await appRendererPromise;

  const ssgResults = await PerfLogger.async(
    `${WorkerLogPrefix} - Task ${logger.name(
      task.id,
    )} - Rendering ${logger.cyan(task.pathnames.length)} pathnames`,
    () => appRenderer.renderPathnames(task.pathnames),
  );

  // Afaik it's not needed to shutdown here,
  // The thread pool destroys worker thread and releases worker thread memory
  // await appRenderer.shutdown();

  return ssgResults;
}

export type ExecuteSSGWorkerThreadTask = typeof executeSSGWorkerThreadTask;
