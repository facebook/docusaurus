/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import os from 'os';
import _ from 'lodash';
import {PerfLogger} from '@docusaurus/logger';
import {generateStaticFiles} from './ssg';
import {createSSGParams} from './ssgParams';
import {renderHashRouterTemplate} from './ssgTemplate';
import {generateHashRouterEntrypoint, SSGWorkerThreads} from './ssgUtils';
import type {Props, RouterType} from '@docusaurus/types';
import type {SiteCollectedData} from '../common';
import type {GenerateStaticFilesResult} from './ssg';
import type {SSGParams} from './ssgParams';

function mergeResults(
  results: GenerateStaticFilesResult[],
): GenerateStaticFilesResult {
  return {
    collectedData: Object.assign({}, ...results.map((r) => r.collectedData)),
  };
}

type SSGExecutor = {
  run: () => Promise<GenerateStaticFilesResult>;
  destroy: () => Promise<void>;
};

type CreateSSGExecutor = (params: {
  params: SSGParams;
  pathnames: string[];
}) => Promise<SSGExecutor>;

const createSimpleSSGExecutor: CreateSSGExecutor = async ({
  params,
  pathnames,
}) => {
  return {
    run: () => {
      return PerfLogger.async(
        'Generate static files - Using current worker thread',
        () =>
          generateStaticFiles({
            pathnames,
            params,
          }),
      );
    },

    destroy: async () => {
      // nothing to do
    },
  };
};

// Sensible default that gives decent performances
// It's hard to have a perfect formula that works for all hosts
// Each thread has some creation overhead
// Having 1 thread per cpu doesn't necessarily improve perf on small sites
// We want to ensure that we don't create a worker thread for less than x paths
function inferNumberOfThreads({
  pageCount,
  cpuCount,
  minPagesPerCpu,
  maxThreads,
}: {
  pageCount: number;
  cpuCount: number;
  minPagesPerCpu: number;
  maxThreads: number;
}) {
  // Calculate "ideal" amount of threads based on the number of pages to render
  const threadsByWorkload = Math.ceil(pageCount / minPagesPerCpu);
  // Use the smallest of threadsByWorkload or cpuCount, ensuring min=1 thread
  const threads = Math.max(1, Math.min(threadsByWorkload, cpuCount));
  return Math.min(maxThreads, threads);
}

function getNumberOfThreads(pathnames: string[]) {
  if (typeof SSGWorkerThreads !== 'undefined') {
    return SSGWorkerThreads;
  }
  return inferNumberOfThreads({
    pageCount: pathnames.length,
    cpuCount: os.cpus().length,

    // These are "magic value" that we should refine based on user feedback
    // Local tests show that it's not worth spawning new workers for few pages
    minPagesPerCpu: 100,
    // Local tests show that even if there are many CPUs and pages
    // Using too many threads decrease performance, probably because of IOs
    maxThreads: 8,
  });
}

const createPooledSSGExecutor: CreateSSGExecutor = async ({
  params,
  pathnames,
}) => {
  // Sensible default that gives the best improvement so far:
  const numberOfThreads = getNumberOfThreads(pathnames);

  // When the inferred or provided number of threads is just 1
  // It's not worth it to use a thread pool
  // This also allows users to disable the thread pool with the env variable
  // DOCUSAURUS_SSG_WORKER_THREADS=1
  if (numberOfThreads === 1) {
    return createSimpleSSGExecutor({params, pathnames});
  }

  // TODO this is not ideal for performance
  //  Some chunks may contain more expensive pages
  //  and we have to wait for the slowest chunk to finish to complete SSG
  //  There can be a significant time lapse between the fastest/slowest worker
  const pathnamesChunks = _.chunk(
    pathnames,
    Math.ceil(pathnames.length / numberOfThreads),
  );

  const pool = await PerfLogger.async(
    `Create SSG pool with ${numberOfThreads} threads`,
    async () => {
      const Tinypool = await import('tinypool').then((m) => m.default);
      return new Tinypool({
        filename: path.posix.resolve(__dirname, './ssg.js'),
        minThreads: numberOfThreads,
        maxThreads: numberOfThreads,
        concurrentTasksPerWorker: 1,
        runtime: 'worker_threads',
      });
    },
  );

  return {
    run: async () => {
      const results = await PerfLogger.async(
        'Generate static files - Using worker threads pool',
        async () => {
          return Promise.all(
            pathnamesChunks.map((chunk, chunkIndex) => {
              return PerfLogger.async(
                `Generate static files for chunk=${chunkIndex} with ${chunk.length} pathnames`,
                () => {
                  return pool.run({
                    pathnames: chunk,
                    params,
                    worker: chunkIndex + 1,
                  }) as Promise<GenerateStaticFilesResult>;
                },
              );
            }),
          );
        },
      );

      return mergeResults(results);
    },

    destroy: async () => {
      await pool.destroy();
    },
  };
};

export async function executeSSG({
  props,
  serverBundlePath,
  clientManifestPath,
  router,
}: {
  props: Props;
  serverBundlePath: string;
  clientManifestPath: string;
  router: RouterType;
}): Promise<{collectedData: SiteCollectedData}> {
  const params = await createSSGParams({
    serverBundlePath,
    clientManifestPath,
    props,
  });

  if (router === 'hash') {
    PerfLogger.start('Generate Hash Router entry point');
    const content = await renderHashRouterTemplate({params});
    await generateHashRouterEntrypoint({content, params});
    PerfLogger.end('Generate Hash Router entry point');
    return {collectedData: {}};
  }

  const createExecutor = props.siteConfig.future.v4.enableSSGWorkerThreads
    ? createPooledSSGExecutor
    : createSimpleSSGExecutor;

  const executor = await createExecutor({params, pathnames: props.routesPaths});

  return executor.run();
}
