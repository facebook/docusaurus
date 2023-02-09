/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import http from 'http';
import path from 'path';
import logger from '@docusaurus/logger';
import {DEFAULT_BUILD_DIR_NAME} from '@docusaurus/utils';
import serveHandler from 'serve-handler';
import openBrowser from 'react-dev-utils/openBrowser';
import {loadSiteConfig} from '../server/config';
import {build} from './build';
import {getHostPort, type HostPortOptions} from '../server/getHostPort';
import type {LoadContextOptions} from '../server';

export type ServeCLIOptions = HostPortOptions &
  Pick<LoadContextOptions, 'config'> & {
    dir?: string;
    build?: boolean;
    open?: boolean;
  };

export async function serve(
  siteDirParam: string = '.',
  cliOptions: Partial<ServeCLIOptions> = {},
): Promise<void> {
  const siteDir = await fs.realpath(siteDirParam);

  const buildDir = cliOptions.dir ?? DEFAULT_BUILD_DIR_NAME;
  let dir = path.resolve(siteDir, buildDir);

  if (cliOptions.build) {
    dir = await build(
      siteDir,
      {
        config: cliOptions.config,
        outDir: dir,
      },
      false,
    );
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

  const server = http.createServer((req, res) => {
    // Automatically redirect requests to /baseUrl/
    if (!req.url?.startsWith(baseUrl)) {
      res.writeHead(302, {
        Location: baseUrl,
      });
      res.end();
      return;
    }

    // Remove baseUrl before calling serveHandler, because /baseUrl/ should
    // serve /build/index.html, not /build/baseUrl/index.html (does not exist)
    req.url = req.url.replace(baseUrl, '/');

    serveHandler(req, res, {
      cleanUrls: true,
      public: dir,
      trailingSlash,
      directoryListing: false,
    });
  });

  const url = servingUrl + baseUrl;
  logger.success`Serving path=${buildDir} directory at: url=${url}`;
  server.listen(port);

  if (cliOptions.open && !process.env.CI) {
    openBrowser(url);
  }
}
