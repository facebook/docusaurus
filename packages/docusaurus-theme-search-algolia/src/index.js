/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const eta = require('eta');
const {normalizeUrl} = require('@docusaurus/utils');
const openSearchTemplate = require('./templates/opensearch');
const {validateThemeConfig} = require('./validateThemeConfig');
const {memoize} = require('lodash');

const getCompiledOpenSearchTemplate = memoize(() => {
  return eta.compile(openSearchTemplate.trim());
});

function renderOpenSearchTemplate(data) {
  const compiled = getCompiledOpenSearchTemplate();
  return compiled(data, eta.defaultConfig);
}

const OPEN_SEARCH_FILENAME = 'opensearch.xml';

function theme(context) {
  const {
    baseUrl,
    siteConfig: {title, url, favicon},
  } = context;
  const pagePath = path.resolve(__dirname, './pages/search/index.js');

  return {
    name: 'docusaurus-theme-search-algolia',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getPathsToWatch() {
      return [pagePath];
    },

    async contentLoaded({actions: {addRoute}}) {
      addRoute({
        path: normalizeUrl([baseUrl, 'search']),
        component: pagePath,
        exact: true,
      });
    },

    async postBuild({outDir}) {
      try {
        fs.writeFileSync(
          path.join(outDir, OPEN_SEARCH_FILENAME),
          renderOpenSearchTemplate({
            title,
            url,
            favicon: normalizeUrl([url, favicon]),
          }),
        );
      } catch (err) {
        console.error(err);
        throw new Error(`Generating OpenSearch file failed: ${err}`);
      }
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'search',
              type: 'application/opensearchdescription+xml',
              title,
              href: normalizeUrl([baseUrl, OPEN_SEARCH_FILENAME]),
            },
          },
        ],
      };
    },
  };
}

module.exports = theme;

theme.validateThemeConfig = validateThemeConfig;
