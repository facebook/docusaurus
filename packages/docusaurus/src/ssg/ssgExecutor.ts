/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PerfLogger} from '@docusaurus/logger';
import {createSSGParams} from './ssgParams';
import {generateStaticFiles} from './ssg';
import {renderHashRouterTemplate} from './ssgTemplate';
import {generateHashRouterEntrypoint} from './ssgUtils';
import type {Props, RouterType} from '@docusaurus/types';
import type {SiteCollectedData} from '../common';

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

  const ssgResult = await PerfLogger.async('Generate static files', () =>
    generateStaticFiles({
      pathnames: props.routesPaths,
      params,
    }),
  );

  return ssgResult;
}
