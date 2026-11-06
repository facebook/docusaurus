/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import http from 'node:http';
import path from 'node:path';
import {pathExists} from '@docusaurus/fs';
import {listenToServer} from '../listenToServer';
import {createServeRequestHandler} from '../requestHandler';
import type {AddressInfo} from 'node:net';
import type {DocusaurusConfig} from '@docusaurus/types';

export type ServeOptions = Pick<DocusaurusConfig, 'baseUrl' | 'trailingSlash'>;

const fixtureOutDir = path.join(__dirname, '__fixtures__/build');

// Added by the test server when the request handler rejects
const CrashHeader = 'x-test-crash';

const MaxRedirects = 5;

// The request paths are appended to the baseUrl
export async function describeServing(
  options: ServeOptions,
  requestPaths: string[],
): Promise<string> {
  const baseUrlPrefix = options.baseUrl.replace(/\/$/, '');
  const paths = requestPaths.map((requestPath) => baseUrlPrefix + requestPath);
  return describeRequests(options, paths);
}

// One line per request, aligned to be easy to review in snapshots
export async function describeRequests(
  options: ServeOptions,
  paths: string[],
): Promise<string> {
  const descriptions = await withServer(options, (origin) =>
    Promise.all(
      paths.map((requestPath) => describeRequest(origin, requestPath)),
    ),
  );
  const pathWidth = Math.max(...paths.map((requestPath) => requestPath.length));
  return paths
    .map(
      (requestPath, index) =>
        `${requestPath.padEnd(pathWidth)}  ${descriptions[index]}`,
    )
    .join('\n');
}

export async function serveRequest(
  options: ServeOptions,
  requestPath: string,
): Promise<string> {
  return withServer(options, (origin) => describeRequest(origin, requestPath));
}

async function withServer<T>(
  options: ServeOptions,
  callback: (origin: string) => Promise<T>,
): Promise<T> {
  const handleRequest = createServeRequestHandler({
    outDir: fixtureOutDir,
    ...options,
  });
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((error: NodeJS.ErrnoException) =>
      respondWithCrash(res, error),
    );
  });

  await listenToServer({server, host: '127.0.0.1', port: 0});
  try {
    const {port} = server.address() as AddressInfo;
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    server.closeAllConnections();
    server.close();
  }
}

// In production, this rejection is unhandled and crashes the server process
function respondWithCrash(
  res: http.ServerResponse,
  error: NodeJS.ErrnoException,
) {
  if (res.headersSent) {
    res.destroy();
    return;
  }
  // A failed writeHead() can leave the Content-Length of the file to serve
  res.writeHead(500, {
    [CrashHeader]: error.code ?? 'unknown',
    'Content-Length': 0,
  });
  res.end();
}

/**
 * Requests a path and follows its redirects, to describe how it's served:
 * "301 /file → 200 file.html"
 */
async function describeRequest(
  origin: string,
  requestPath: string,
): Promise<string> {
  const descriptions: string[] = [];

  // Concatenated: new URL('//file', origin) would read "file" as a host name
  let url = origin + requestPath;
  while (descriptions.length <= MaxRedirects) {
    const response = await fetch(url, {redirect: 'manual'});
    descriptions.push(await describeResponse(response));

    const location = response.headers.get('location');
    if (location === null) {
      break;
    }
    url = new URL(location, url).href;
  }

  return descriptions.join(' → ');
}

async function describeResponse(response: Response): Promise<string> {
  const body = await response.text();

  const crashCode = response.headers.get(CrashHeader);
  if (crashCode !== null) {
    return `crash ${crashCode}`;
  }

  const location = response.headers.get('location');
  if (location !== null) {
    return `${response.status} ${location}`;
  }

  const servedFile = (await getServedFixtureFile(body)) ?? response.statusText;
  return `${response.status} ${servedFile}`;
}

// Each fixture build file contains its own path
async function getServedFixtureFile(body: string): Promise<string | undefined> {
  const filePath = body.trim();
  const isFixtureFile =
    filePath !== '' && (await pathExists(path.join(fixtureOutDir, filePath)));
  return isFixtureFile ? filePath : undefined;
}
