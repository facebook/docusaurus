/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function normalizeLocation(location) {
  let pathname = location.pathname || '/';
  pathname = pathname.trim().replace(/\/index\.html$/, '');
  if (pathname === '') {
    pathname = '/';
  }
  return {
    ...location,
    pathname,
  };
}

export default normalizeLocation;
