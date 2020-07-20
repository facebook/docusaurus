/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import http from 'http';
import serveHandler from 'serve-handler';
import boxen from 'boxen';
import chalk from 'chalk';
import path from 'path';

import build from './build';
import choosePort from '../choosePort';

export default async function serve(
  siteDir: string,
  cliOptions: {port: number; build: boolean; dir: string},
): Promise<void> {
  let dir = path.join(siteDir, cliOptions.dir);
  if (cliOptions.build) {
    dir = await build(
      siteDir,
      {
        outDir: dir,
      },
      false,
    );
  }
  const port = await choosePort('localhost', cliOptions.port);
  const server = http.createServer((req, res) => {
    serveHandler(req, res, {
      cleanUrls: true,
      public: dir,
    });
  });
  console.log(
    boxen(
      `${chalk.green(
        `Serving ${cliOptions.dir}!`,
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
