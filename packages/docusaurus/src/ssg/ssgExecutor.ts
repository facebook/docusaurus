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
import {generateHashRouterEntrypoint} from './ssgUtils';
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
      return PerfLogger.async('Generate static files', () =>
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

const createPooledSSGExecutor: CreateSSGExecutor = async ({
  params,
  pathnames,
}) => {
  // TODO make this configurable
  // Sensible default that gives the best improvement so far:
  const numberOfThreads = os.cpus().length / 2;

  const pathnamesChunks = _.chunk(
    pathnames,
    Math.ceil(pathnames.length / numberOfThreads),
  );

  const pool = await PerfLogger.async(
    `Create SSG pool with ${numberOfThreads} threads`,
    async () => {
      const Tinypool = await import('tinypool').then((m) => m.default);
      return new Tinypool({
        filename: path.resolve(__dirname, './ssg.js'),
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
        'Generate static files - pooled',
        async () => {
          return Promise.all(
            pathnamesChunks.map((chunk, chunkIndex) => {
              return PerfLogger.async(
                `Generate static files for chunk=${chunkIndex} with ${chunk.length} pathnames`,
                () => {
                  return pool.run({
                    pathnames: chunk,
                    params,
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

// TODO Docusaurus v4 - introduce SSG worker threads
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

  const createExecutor =
    process.env.DOCUSAURUS_DISABLE_SSG_POOL === 'true'
      ? createSimpleSSGExecutor
      : createPooledSSGExecutor;

  const executor = await createExecutor({params, pathnames: props.routesPaths});

  return executor.run();
}
