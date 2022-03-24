/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import type {TranslationFileContent, TranslationFile} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID, I18N_DIR_NAME} from './constants';

/**
 * Takes a list of translation file contents, and shallow-merges them into one.
 */
export function mergeTranslations(
  contents: TranslationFileContent[],
): TranslationFileContent {
  return contents.reduce((acc, content) => ({...acc, ...content}), {});
}

/**
 * Useful to update all the messages of a translation file. Used in tests to
 * simulate translations.
 */
export function updateTranslationFileMessages(
  translationFile: TranslationFile,
  updateMessage: (message: string) => string,
): TranslationFile {
  return {
    ...translationFile,
    content: _.mapValues(translationFile.content, (translation) => ({
      ...translation,
      message: updateMessage(translation.message),
    })),
  };
}

/**
 * Takes everything needed and constructs a plugin i18n path. Plugins should
 * expect everything it needs for translations to be found under this path.
 */
export function getPluginI18nPath({
  siteDir,
  locale,
  pluginName,
  pluginId = DEFAULT_PLUGIN_ID,
  subPaths = [],
}: {
  siteDir: string;
  locale: string;
  pluginName: string;
  pluginId?: string | undefined;
  subPaths?: string[];
}): string {
  return path.join(
    siteDir,
    I18N_DIR_NAME,
    // namespace first by locale: convenient to work in a single folder for a
    // translator
    locale,
    // Make it convenient to use for single-instance
    // ie: return "docs", not "docs-default" nor "docs/default"
    `${pluginName}${pluginId === DEFAULT_PLUGIN_ID ? '' : `-${pluginId}`}`,
    ...subPaths,
  );
}
