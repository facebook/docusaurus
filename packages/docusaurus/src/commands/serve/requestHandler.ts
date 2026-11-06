/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import serveHandler from 'serve-handler';
import {fs} from '@docusaurus/fs';
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
    const redirectLocation = getRedirectLocation(req.url, {
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
        // The default value has the file name, which crashes Node.js when it
        // has Latin-1 characters like "café.html"
        // See https://github.com/vercel/serve-handler/issues/205
        headers: [
          {
            source: '**',
            headers: [{key: 'Content-Disposition', value: 'inline'}],
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

function getRedirectLocation(
  url: string | undefined,
  {baseUrl, trailingSlash}: Pick<DocusaurusConfig, 'baseUrl' | 'trailingSlash'>,
): string | undefined {
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
    if (!looksLikeAsset) {
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
