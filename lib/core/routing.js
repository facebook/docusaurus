/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const escapeStringRegexp = require('escape-string-regexp');

function docsRouting(baseUrl) {
  return new RegExp(`^${escapeStringRegexp(baseUrl)}docs\/.*html$`);
}

function blogRouting(baseUrl) {
  return new RegExp(`^${escapeStringRegexp(baseUrl)}blog\/.*html$`);
}

module.exports = {
  docsRouting,
  blogRouting,
};
