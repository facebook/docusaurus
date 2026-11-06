/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import serveHandler from 'serve-handler';
import {fs, pathExists} from '@docusaurus/fs';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import {parseURLPath, serializeURLPath} from '@docusaurus/utils';
import type http from 'node:http';
import type {DocusaurusConfig} from '@docusaurus/types';

type ServeRequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void>;

type ServeHandlerMethods = NonNullable<Parameters<typeof serveHandler>[3]>;

export function createServeRequestHandler({
  outDir,
  baseUrl,
  trailingSlash,
}: {outDir: string} & Pick<
  DocusaurusConfig,
  'baseUrl' | 'trailingSlash'
>): ServeRequestHandler {
  return async (req, res) => {
    // Browsers must revalidate every response, so that a rebuild or a config
    // change never leaves a stale page or redirect in their cache
    // Set here because serve-handler doesn't apply `headers` to its redirects
    // See https://github.com/meta/docusaurus/pull/12903
    res.setHeader('Cache-Control', 'no-cache');

    const redirectLocation = await getRedirectLocation(req.url, {
      outDir,
      baseUrl,
      trailingSlash,
    });
    if (redirectLocation !== undefined) {
      redirect(res, redirectLocation);
      return;
    }

    // Remove baseUrl before calling serveHandler, because /baseUrl/ should
    // serve /build/index.html, not /build/baseUrl/index.html (does not exist)
    // Note server-handler is really annoying here:
    // - no easy way to do rewrites such as "/baseUrl/:path" => "/:path"
    // - no easy way to "reapply" the baseUrl to the redirect "Location" header
    // See also https://github.com/meta/docusaurus/pull/10090
    // Requests without url were redirected to the baseUrl
    req.url = req.url!.replace(baseUrl, '/');

    await serveHandler(
      req,
      res,
      {
        cleanUrls: true,
        public: outDir,
        trailingSlash,
        directoryListing: false,
        // serve-handler only answers 304 to an ETag revalidation, and the ETag
        // stays the same when a rebuild doesn't change the file content
        etag: true,
        headers: [
          // The default value has the file name, which crashes Node.js when it
          // has Latin-1 characters like "café.html"
          // See https://github.com/vercel/serve-handler/issues/205
          {
            source: '**',
            headers: [{key: 'Content-Disposition', value: 'inline'}],
          },
          // The bundler adds a content hash to the names of these files
          // Overrides the Cache-Control set above, only for existing files
          {
            source: 'assets/**',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
        ],
      },
      // serve-handler awaits it, @types/serve-handler wrongly expects callbacks
      {
        lstat:
          lstatWithoutDottedFolders as unknown as ServeHandlerMethods['lstat'],
      },
    );
  };
}

// serve-handler doesn't look for the index.html of folders with a dot in their
// name, like "docs/2.x": hiding them makes it fall back to their index.html
// TODO remove after the release of https://github.com/vercel/serve-handler/pull/230
async function lstatWithoutDottedFolders(filePath: string) {
  const stats = await fs.lstat(filePath);
  if (stats.isDirectory() && path.extname(filePath) !== '') {
    throw Object.assign(new Error(`${filePath} is a folder`), {code: 'ENOENT'});
  }
  return stats;
}

async function getRedirectLocation(
  url: string | undefined,
  {
    outDir,
    baseUrl,
    trailingSlash,
  }: {outDir: string} & Pick<DocusaurusConfig, 'baseUrl' | 'trailingSlash'>,
): Promise<string | undefined> {
  // Automatically redirect requests to /baseUrl/
  if (!url?.startsWith(baseUrl)) {
    return baseUrl;
  }

  // We do the redirect ourselves for a good reason
  // server-handler is annoying and won't include /baseUrl/ in redirects
  // See https://github.com/meta/docusaurus/issues/10078#issuecomment-2084932934
  if (baseUrl !== '/') {
    const {pathname, search} = parseURLPath(url);
    // ".." can resolve outside of the baseUrl, even to another host: "//host"
    // Like without a baseUrl, serve-handler answers 400 to these paths
    if (!pathname.startsWith(baseUrl)) {
      return undefined;
    }

    // Merge repeated slashes, like the serve-handler redirects
    const mergedPathname = pathname.replace(/\/{2,}/g, '/');
    if (pathname !== mergedPathname) {
      return serializeURLPath({pathname: mergedPathname, search});
    }

    const cleanPathname = getCleanPathname(pathname, baseUrl);
    if (pathname !== cleanPathname) {
      return serializeURLPath({pathname: cleanPathname, search});
    }

    // Not super robust, but should be good enough for our use case
    // See https://github.com/meta/docusaurus/pull/10090
    const looksLikeAsset = !!pathname.match(/\.[a-z\d]+$/i);
    const isAsset =
      looksLikeAsset &&
      !(await isPage(outDir, pathname.slice(baseUrl.length - 1)));
    if (!isAsset) {
      const normalizedPathname = applyTrailingSlash(pathname, {
        trailingSlash,
        baseUrl,
      });
      if (pathname !== normalizedPathname) {
        return serializeURLPath({pathname: normalizedPathname, search});
      }
    }
  }

  return undefined;
}

// Pages with a dot in their name look like assets, like "docs/2.x"
async function isPage(outDir: string, urlPath: string): Promise<boolean> {
  let filePath: string;
  try {
    filePath = path.join(outDir, decodeURIComponent(urlPath));
  } catch {
    return false; // Malformed percent-encoding
  }
  // Encoded slashes can decode to ".." segments: never look outside outDir
  if (path.relative(outDir, filePath).startsWith('..')) {
    return false;
  }
  return (
    (await pathExists(path.join(filePath, 'index.html'))) ||
    pathExists(`${filePath}.html`)
  );
}

// The serve-handler cleanUrls redirect, keeping the baseUrl
function getCleanPathname(pathname: string, baseUrl: string): string {
  const cleanPathname = pathname.replace(/(?:\.html|\/index)$/, '');
  // Like serve-handler, /index redirects to /
  return cleanPathname === baseUrl.slice(0, -1) ? baseUrl : cleanPathname;
}

function redirect(res: http.ServerResponse, location: string) {
  res.writeHead(302, {
    Location: location,
  });
  res.end();
}
