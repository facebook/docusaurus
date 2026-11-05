/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import http from 'node:http';
import path from 'node:path';
import logger from '@docusaurus/logger';
import {realpath} from '@docusaurus/fs';
import {build} from '../../build/build';
import {serve, type ServeCLIOptions} from '../serve';
import {describeRequest, fixtureSiteDir} from './testUtils';
import type {AddressInfo} from 'node:net';

vi.mock('../../../server/getHostPort', () => ({
  // Port 0 lets the OS pick a free port
  getHostPort: async () => ({host: '127.0.0.1', port: 0}),
}));

vi.mock('../../build/build', () => ({build: vi.fn()}));

describe('serve', () => {
  const servers: http.Server[] = [];

  beforeEach(() => {
    vi.spyOn(logger, 'success').mockImplementation(() => {});
  });

  afterEach(() => {
    servers.forEach((server) => {
      server.closeAllConnections();
      server.close();
    });
    servers.length = 0;
    vi.restoreAllMocks();
  });

  // Returns the origin of the server that serve() started
  async function serveFixtureSite(
    cliOptions: Partial<ServeCLIOptions> = {},
  ): Promise<string> {
    const createServer = vi.spyOn(http, 'createServer');
    await serve(fixtureSiteDir, {open: false, ...cliOptions});

    const server = createServer.mock.results[0]!.value as http.Server;
    servers.push(server);
    const {port} = server.address() as AddressInfo;
    return `http://127.0.0.1:${port}`;
  }

  it('serves the build directory with the baseUrl and trailingSlash of the site config', async () => {
    const origin = await serveFixtureSite();
    await expect(describeRequest(origin, '/base/file/')).resolves.toBe(
      '302 /base/file → 200 file.html',
    );
  });

  it('serves the --dir directory', async () => {
    const origin = await serveFixtureSite({dir: 'build/folder'});
    await expect(describeRequest(origin, '/base/')).resolves.toBe(
      '200 folder/index.html',
    );
  });

  it('loads the --config site config', async () => {
    const origin = await serveFixtureSite({config: 'custom.config.js'});
    await expect(describeRequest(origin, '/custom/file')).resolves.toBe(
      '200 file.html',
    );
  });

  it('builds the site in the served directory with --build', async () => {
    await serveFixtureSite({build: true, config: 'custom.config.js'});

    const siteDir = await realpath(fixtureSiteDir);
    expect(build).toHaveBeenCalledWith(siteDir, {
      config: 'custom.config.js',
      outDir: path.join(siteDir, 'build'),
    });
  });
});
