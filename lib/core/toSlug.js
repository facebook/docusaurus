/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const unidecode = require('unidecode');

module.exports = string => {
  let slug = unidecode(string.toString())
    // Handle uppercase characters
    .toLowerCase()
    // Replace `.`, `(` and `?` with blank string like Github does
    .replace(/\.|\(|\?/g, '')
    // Dash special characters
    .replace(/[^a-z0-9]/g, '-')
    // Compress multiple dash
    .replace(/-+/g, '-')
    // Trim dashes
    .replace(/^-|-$/g, '');

  // Add trailing `-` if string contains ` ...` in the end like Github does
  if (/\s[.]{1,}/.test(string)) {
    slug += '-';
  }

  return slug;
};
