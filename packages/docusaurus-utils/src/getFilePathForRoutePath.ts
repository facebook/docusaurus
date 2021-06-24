/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

/*
export function getFilePathForRoutePath(routePath: string): string {
  const fileName = path.basename(routePath);
  const filePath = path.dirname(routePath);
  return path.join(filePath, `${fileName}/index.html`);
}
 */

// Almost exact copy of the behavior we implemented in our Docusaurus fork of the webpack static gen plugin
// See https://github.com/slorber/static-site-generator-webpack-plugin/blob/master/index.js#L167
export function getFilePathForRoutePath(
  routePath: string,
  trailingSlash: boolean | undefined,
): string {
  // const outputFileName = routePath.replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server

  // Paths ending with .html are left untouched
  if (/\.(html?)$/i.test(routePath)) {
    return routePath;
  }

  // Legacy retro-compatible behavior
  if (typeof trailingSlash === 'undefined') {
    return path.join(routePath, 'index.html');
  }

  // New behavior: we can say if we prefer file/folder output
  // Useful resource: https://github.com/slorber/trailing-slash-guide
  if (routePath === '' || routePath.endsWith('/') || trailingSlash) {
    return path.join(routePath, 'index.html');
  } else {
    return `${routePath}.html`;
  }
}
