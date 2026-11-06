/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {once} from 'node:events';
import http from 'node:http';
import path from 'node:path';
import {buffer} from 'node:stream/consumers';
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

type RequestOptions = {
  // Send the request paths as-is, without normalizing them like browsers do
  asIs?: boolean;
};

// The request paths are appended to the baseUrl
export async function describeServing(
  options: ServeOptions,
  requestPaths: string[],
  requestOptions: RequestOptions = {},
): Promise<string> {
  const baseUrlPrefix = options.baseUrl.replace(/\/$/, '');
  const paths = requestPaths.map((requestPath) => baseUrlPrefix + requestPath);
  return describeRequests(options, paths, requestOptions);
}

// One line per request, aligned to be easy to review in snapshots
export async function describeRequests(
  options: ServeOptions,
  paths: string[],
  requestOptions: RequestOptions = {},
): Promise<string> {
  const descriptions = await withServer(options, (origin) =>
    Promise.all(
      paths.map((requestPath) =>
        describeRequest(origin, requestPath, requestOptions),
      ),
    ),
  );
  return alignDescriptions(paths, descriptions);
}

// One line per request, describing the caching headers of its response,
// without following redirects: "200 no-cache + ETag"
export async function describeCaching(
  options: ServeOptions,
  paths: string[],
): Promise<string> {
  const descriptions = await withServer(options, (origin) =>
    Promise.all(
      paths.map((requestPath) => describeRequestCaching(origin, requestPath)),
    ),
  );
  return alignDescriptions(paths, descriptions);
}

export async function serveRequest(
  options: ServeOptions,
  requestPath: string,
): Promise<string> {
  return withServer(options, (origin) => describeRequest(origin, requestPath));
}

// Requests a path again with the ETag of its first response, like a browser
// revalidating its cache: "304 no-cache"
export async function revalidateRequest(
  options: ServeOptions,
  requestPath: string,
): Promise<string> {
  return withServer(options, async (origin) => {
    const url = origin + requestPath;
    const response = await fetch(url);
    await response.arrayBuffer();

    const etag = response.headers.get('etag');
    if (etag === null) {
      return `${response.status} without ETag`;
    }
    const revalidation = await fetch(url, {headers: {'If-None-Match': etag}});
    await revalidation.arrayBuffer();
    return describeCachingHeaders(revalidation);
  });
}

function alignDescriptions(paths: string[], descriptions: string[]): string {
  const pathWidth = Math.max(...paths.map((requestPath) => requestPath.length));
  return paths
    .map(
      (requestPath, index) =>
        `${requestPath.padEnd(pathWidth)}  ${descriptions[index]}`,
    )
    .join('\n');
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
  {asIs = false}: RequestOptions = {},
): Promise<string> {
  const descriptions: string[] = [];

  // Concatenated: new URL('//file', origin) would read "file" as a host name
  let url = origin + requestPath;
  while (descriptions.length <= MaxRedirects) {
    // Browsers normalize the redirect URLs they follow
    const isFirstRequest = descriptions.length === 0;
    const response =
      asIs && isFirstRequest
        ? await fetchAsIs(origin, requestPath)
        : await fetch(url, {redirect: 'manual'});
    descriptions.push(await describeResponse(response));

    const location = response.headers.get('location');
    if (location === null) {
      break;
    }
    const nextUrl = new URL(location, url);
    // Never follow open redirects to other hosts
    if (nextUrl.origin !== origin) {
      break;
    }
    url = nextUrl.href;
  }

  return descriptions.join(' → ');
}

// fetch() normalizes the URL like browsers do: it resolves "..", drops the
// #hash... http.get() sends the path as-is, like a hand-typed request
async function fetchAsIs(
  origin: string,
  requestPath: string,
): Promise<Response> {
  const {hostname, port} = new URL(origin);
  const request = http.get({hostname, port, path: requestPath});
  const [res] = (await once(request, 'response')) as [http.IncomingMessage];

  const headers = new Headers();
  for (const [name, values] of Object.entries(res.headersDistinct)) {
    values?.forEach((value) => headers.append(name, value));
  }
  return new Response(await buffer(res), {
    status: res.statusCode,
    statusText: res.statusMessage,
    headers,
  });
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

async function describeRequestCaching(
  origin: string,
  requestPath: string,
): Promise<string> {
  const response = await fetch(origin + requestPath, {redirect: 'manual'});
  await response.arrayBuffer();
  return describeCachingHeaders(response);
}

function describeCachingHeaders(response: Response): string {
  const cacheControl =
    response.headers.get('cache-control') ?? 'no Cache-Control';
  const validators = ['ETag', 'Last-Modified'].filter((name) =>
    response.headers.has(name),
  );
  return [`${response.status} ${cacheControl}`, ...validators].join(' + ');
}

// Each fixture build file contains its own path
async function getServedFixtureFile(body: string): Promise<string | undefined> {
  const filePath = body.trim();
  const isFixtureFile =
    filePath !== '' && (await pathExists(path.join(fixtureOutDir, filePath)));
  return isFixtureFile ? filePath : undefined;
}
