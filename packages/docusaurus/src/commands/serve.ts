/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import http from 'http';
import serveHandler from 'serve-handler';
import logger from '@docusaurus/logger';
import path from 'path';
import {loadSiteConfig} from '../server';
import build from './build';
import {getCLIOptionHost, getCLIOptionPort} from './commandUtils';
import type {ServeCLIOptions} from '@docusaurus/types';

export default async function serve(
  siteDir: string,
  cliOptions: ServeCLIOptions,
): Promise<void> {
  let dir = path.isAbsolute(cliOptions.dir)
    ? cliOptions.dir
    : path.join(siteDir, cliOptions.dir);

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

  const host: string = getCLIOptionHost(cliOptions.host);
  const port: number | null = await getCLIOptionPort(cliOptions.port, host);

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

    // Remove baseUrl before calling serveHandler
    // Reason: /baseUrl/ should serve /build/index.html, not /build/baseUrl/index.html (does not exist)
    req.url = req.url?.replace(baseUrl, '/');

    serveHandler(req, res, {
      cleanUrls: true,
      public: dir,
      trailingSlash,
    });
  });

  logger.success`Serving path=${cliOptions.dir} directory at path=${
    servingUrl + baseUrl
  }.`;
  server.listen(port);
}
