/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve, join} from 'path';
import {writeFileSync} from 'fs';
import {compile, defaultConfig} from 'eta';
import {normalizeUrl, getSwizzledComponent} from '@docusaurus/utils';
import {trim} from './templates/opensearch';
import {validateThemeConfig} from './validateThemeConfig';
import {memoize} from 'lodash';

const getCompiledOpenSearchTemplate = memoize(() => {
  return compile(trim());
});

function renderOpenSearchTemplate(data) {
  const compiled = getCompiledOpenSearchTemplate();
  return compiled(data, defaultConfig);
}

const OPEN_SEARCH_FILENAME = 'opensearch.xml';

function theme(context) {
  const {
    baseUrl,
    siteConfig: {title, url, favicon},
  } = context;
  const pageComponent = './theme/SearchPage/index.js';
  const pagePath =
    getSwizzledComponent(pageComponent) || resolve(__dirname, pageComponent);

  return {
    name: 'docusaurus-theme-search-algolia',

    getThemePath() {
      return resolve(__dirname, './theme');
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
        writeFileSync(
          join(outDir, OPEN_SEARCH_FILENAME),
          renderOpenSearchTemplate({
            title,
            url: url + baseUrl,
            favicon: favicon ? normalizeUrl([url, baseUrl, favicon]) : null,
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

export default theme;

export {validateThemeConfig};
