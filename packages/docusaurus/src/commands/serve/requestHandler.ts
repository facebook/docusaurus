/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import serveHandler from 'serve-handler';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import type http from 'node:http';
import type {DocusaurusConfig} from '@docusaurus/types';

type ServeRequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void>;

export function createServeRequestHandler({
  outDir,
  baseUrl,
  trailingSlash,
}: {outDir: string} & Pick<
  DocusaurusConfig,
  'baseUrl' | 'trailingSlash'
>): ServeRequestHandler {
  return async (req, res) => {
    // Automatically redirect requests to /baseUrl/
    if (!req.url?.startsWith(baseUrl)) {
      redirect(res, baseUrl);
      return;
    }

    // We do the redirect ourselves for a good reason
    // server-handler is annoying and won't include /baseUrl/ in redirects
    // See https://github.com/meta/docusaurus/issues/10078#issuecomment-2084932934
    if (baseUrl !== '/') {
      // Not super robust, but should be good enough for our use case
      // See https://github.com/meta/docusaurus/pull/10090
      const looksLikeAsset = !!req.url.match(/\.[a-z\d]{1,4}$/i);
      if (!looksLikeAsset) {
        const normalizedUrl = applyTrailingSlash(req.url, {
          trailingSlash,
          baseUrl,
        });
        if (req.url !== normalizedUrl) {
          redirect(res, normalizedUrl);
          return;
        }
      }
    }

    // Remove baseUrl before calling serveHandler, because /baseUrl/ should
    // serve /build/index.html, not /build/baseUrl/index.html (does not exist)
    // Note server-handler is really annoying here:
    // - no easy way to do rewrites such as "/baseUrl/:path" => "/:path"
    // - no easy way to "reapply" the baseUrl to the redirect "Location" header
    // See also https://github.com/meta/docusaurus/pull/10090
    req.url = req.url.replace(baseUrl, '/');

    await serveHandler(req, res, {
      cleanUrls: true,
      public: outDir,
      trailingSlash,
      directoryListing: false,
    });
  };
}

function redirect(res: http.ServerResponse, location: string) {
  res.writeHead(302, {
    Location: location,
  });
  res.end();
}
