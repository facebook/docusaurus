/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;

/**
 * Custom function that wraps renderToStaticMarkup so that we can inject
 * doctype before React renders the contents. All instance of full-page
 * rendering within Docusaurus should use this function instead.
 */
function renderToStaticMarkupWithDoctype(...args) {
  return `<!DOCTYPE html>${renderToStaticMarkup(...args)}`;
}

module.exports = {
  renderToStaticMarkupWithDoctype,
};
