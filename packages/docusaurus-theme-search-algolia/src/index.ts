/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {defaultConfig, compile} from 'eta';
import {normalizeUrl} from '@docusaurus/utils';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import openSearchTemplate from './templates/opensearch';

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {ThemeConfig} from '@docusaurus/theme-search-algolia';

const getCompiledOpenSearchTemplate = _.memoize(() =>
  compile(openSearchTemplate.trim()),
);

function renderOpenSearchTemplate(data: {
  title: string;
  siteUrl: string;
  searchUrl: string;
  faviconUrl: string | null;
}) {
  const compiled = getCompiledOpenSearchTemplate();
  return compiled(data, defaultConfig);
}

const OPEN_SEARCH_FILENAME = 'opensearch.xml';

export default function themeSearchAlgolia(context: LoadContext): Plugin<void> {
  const {
    baseUrl,
    siteConfig: {title, url, favicon, themeConfig},
    i18n: {currentLocale},
  } = context;
  const {
    algolia: {searchPagePath},
  } = themeConfig as ThemeConfig;

  return {
    name: 'docusaurus-theme-search-algolia',

    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-search-algolia',
      });
    },

    contentLoaded({actions: {addRoute}}) {
      if (searchPagePath) {
        addRoute({
          path: normalizeUrl([baseUrl, searchPagePath]),
          component: '@theme/SearchPage',
          exact: true,
        });
      }
    },

    async postBuild({outDir}) {
      if (searchPagePath) {
        const siteUrl = normalizeUrl([url, baseUrl]);

        try {
          await fs.writeFile(
            path.join(outDir, OPEN_SEARCH_FILENAME),
            renderOpenSearchTemplate({
              title,
              siteUrl,
              searchUrl: normalizeUrl([siteUrl, searchPagePath]),
              faviconUrl: favicon ? normalizeUrl([siteUrl, favicon]) : null,
            }),
          );
        } catch (err) {
          logger.error('Generating OpenSearch file failed.');
          throw err;
        }
      }
    },

    injectHtmlTags() {
      if (!searchPagePath) {
        return {};
      }

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
