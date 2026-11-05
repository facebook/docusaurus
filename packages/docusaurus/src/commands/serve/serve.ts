/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import http from 'node:http';
import path from 'node:path';
import logger from '@docusaurus/logger';
import {DEFAULT_BUILD_DIR_NAME} from '@docusaurus/utils';
import {realpath} from '@docusaurus/fs';
import openBrowser from '../utils/openBrowser/openBrowser';
import {loadSiteConfig} from '../../server/config';
import {build} from '../build/build';
import {getHostPort, type HostPortOptions} from '../../server/getHostPort';
import {listenToServer} from '../utils/listenToServer';
import {createServeRequestHandler} from './requestHandler';
import type {LoadContextParams} from '../../server/site';

export type ServeCLIOptions = HostPortOptions &
  Pick<LoadContextParams, 'config'> & {
    dir?: string;
    build?: boolean;
    open?: boolean;
  };

export async function serve(
  siteDirParam: string = '.',
  cliOptions: Partial<ServeCLIOptions> = {},
): Promise<void> {
  const siteDir = await realpath(siteDirParam);

  const buildDir = cliOptions.dir ?? DEFAULT_BUILD_DIR_NAME;
  const outDir = path.resolve(siteDir, buildDir);

  if (cliOptions.build) {
    await build(siteDir, {
      config: cliOptions.config,
      outDir,
    });
  }

  const {host, port} = await getHostPort(cliOptions);

  if (port === null) {
    process.exit();
  }

  const {
    siteConfig: {baseUrl, trailingSlash},
  } = await loadSiteConfig({
    siteDir,
    customConfigFilePath: cliOptions.config,
  });

  const servingUrl = `http://${host}:${port}`;

  const server = http.createServer(
    createServeRequestHandler({outDir, baseUrl, trailingSlash}),
  );

  const url = servingUrl + baseUrl;
  logger.success`Serving path=${buildDir} directory at: url=${url}`;
  await listenToServer({server, host, port});

  if (cliOptions.open && !process.env.CI) {
    await openBrowser(url);
  }
}
