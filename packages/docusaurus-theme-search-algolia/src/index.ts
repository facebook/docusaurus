/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs';
import {defaultConfig, compile} from 'eta';
import {normalizeUrl, getSwizzledComponent} from '@docusaurus/utils';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import openSearchTemplate from './templates/opensearch';
import {memoize} from 'lodash';

import type {DocusaurusContext, Plugin} from '@docusaurus/types';

const getCompiledOpenSearchTemplate = memoize(() =>
  compile(openSearchTemplate.trim()),
);

function renderOpenSearchTemplate(data: {
  title: string;
  url: string;
  favicon: string | null;
}) {
  const compiled = getCompiledOpenSearchTemplate();
  return compiled(data, defaultConfig);
}

const OPEN_SEARCH_FILENAME = 'opensearch.xml';

export default function theme(
  context: DocusaurusContext & {baseUrl: string},
): Plugin<void> {
  const {
    baseUrl,
    siteConfig: {title, url, favicon},
    i18n: {currentLocale},
  } = context;
  const pageComponent = './theme/SearchPage/index.js';
  const pagePath =
    getSwizzledComponent(pageComponent) ||
    path.resolve(__dirname, pageComponent);

  return {
    name: 'docusaurus-theme-search-algolia',

    getPathsToWatch() {
      return [pagePath];
    },

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-search-algolia',
      });
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

export {validateThemeConfig} from './validateThemeConfig';
