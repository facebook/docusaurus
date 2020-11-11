/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TranslationFile} from '@docusaurus/types';
import {ThemeConfig} from './utils/useThemeConfig';

// TODO imports due to transpiling with target esnext...
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {keyBy, chain} = require('lodash');

function getNavbarTranslationFile(themeConfig: ThemeConfig): TranslationFile {
  // TODO POC code
  const navbarItemsTranslations = chain(
    themeConfig.navbar.items.map((item) => item.label).filter(Boolean),
  )
    .keyBy((label) => `items.labels.${label}`)
    .mapValues((label) => ({message: label}))
    .value();

  return {
    path: path.join('navbar'),
    content: navbarItemsTranslations,
  };
}

exports.getTranslationFiles = async function getTranslationFiles({
  themeConfig,
}: {
  themeConfig: ThemeConfig;
}): Promise<TranslationFile[]> {
  //  TODO POC code

  /*
  const footerFile = {
     links: themeConfig.footer.links.map((linkColumn) => ({
        title: linkColumn.title,
        labels: keyBy(
          linkColumn.items.map((item) => item.label).filter(Boolean),
          (label) => label,
        ),
      })),
  };

   */

  return [getNavbarTranslationFile(themeConfig)];
};

// TODO extract in separate  method
// eslint-disable-next-line no-shadow
exports.translateThemeConfig = function translateThemeConfig({
  themeConfig,
  translationFiles,
}: {
  themeConfig: ThemeConfig;
  translationFiles: TranslationFile[];
}): ThemeConfig {
  // TODO common, should we transform to map in core?
  const translationFilesMap: Record<string, TranslationFile> = keyBy(
    translationFiles,
    (f) => f.path,
  );

  const navbarTranslations = translationFilesMap.navbar.content;

  // const footerTranslations  = translationFilesMap.footer.content;

  return {
    ...themeConfig,
    navbar: {
      ...themeConfig.navbar,
      items: themeConfig.navbar.items.map((item) => ({
        ...item,
        label:
          navbarTranslations[`items.labels.${item.label}`]?.message ??
          item.label,
      })),
    },
    /*
    footer: {
      ...themeConfig.footer,
      links: themeConfig.footer.links.map((linkColumn, index) => ({
        ...linkColumn,
        title: translations?.footer?.links?.[index]?.title ?? linkColumn.title,
        items: themeConfig.footer.links[index].items.map((item) => ({
          ...item,
          label:
            translations?.footer?.links?.[index]?.labels?.[item.label] ??
            item.label,
        })),
      })),
    },
     */
  };
};
