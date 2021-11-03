/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import eta from 'eta';
import {normalizeUrl, getSwizzledComponent} from '@docusaurus/utils';
import openSearchTemplate from './templates/opensearch';
import {validateThemeConfig} from './validateThemeConfig';
import {memoize} from 'lodash-es';

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
  const pageComponent = './theme/SearchPage/index.js';
  const pagePath =
    getSwizzledComponent(pageComponent) ||
    new URL(pageComponent, import.meta.url).pathname;

  return {
    name: 'docusaurus-theme-search-algolia',

    getThemePath() {
      return new URL('./theme', import.meta.url).pathname;
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
