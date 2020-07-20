/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import build from './build';
import {BuildCLIOptions} from '@docusaurus/types';
import http from 'http';
import portFinder from 'portfinder';
import serveHandler from 'serve-handler';
import boxen from 'boxen';
import chalk from 'chalk';

export default async function serve(
  siteDir: string,
  cliOptions: BuildCLIOptions & {port: number},
): Promise<void> {
  const dir = await build(siteDir, cliOptions, false);
  const port = await portFinder.getPortPromise({
    port: cliOptions.port,
  });
  const server = http.createServer((req, res) => {
    serveHandler(req, res, {
      cleanUrls: true,
      public: dir,
    });
  });
  console.log(
    boxen(
      `${chalk.green(
        `Serving ${cliOptions.outDir}!`,
      )}\n\n- Local: http://localhost:${port}`,
      {
        borderColor: 'green',
        padding: 1,
        margin: 1,
        align: 'center',
      },
    ),
  );
  server.listen(port);
}
