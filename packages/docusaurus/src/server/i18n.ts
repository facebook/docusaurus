/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {I18n, DocusaurusConfig} from '@docusaurus/types';

export function loadI18n(
  config: DocusaurusConfig,
  options: {locale?: string} = {},
): I18n {
  const i18nConfig = config.i18n;
  const currentLocale = options.locale ?? i18nConfig.defaultLocale;

  if (currentLocale && !i18nConfig.locales.includes(currentLocale)) {
    throw new Error(
      `It is not possible to load Docusaurus with locale="${currentLocale}".
This locale is not in the available locales of your site configuration: config.i18n.locales=[${i18nConfig.locales.join(
        ',',
      )}]
Note: Docusaurus only support running one local at a time.`,
    );
  }

  return {
    ...i18nConfig,
    currentLocale,
  };
}
