/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import IconLanguage from '@theme/IconLanguage';
import type {Props} from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}: Props): JSX.Element {
  const {
    siteConfig: {baseUrl},
    i18n: {defaultLocale, currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const {pathname} = useLocation();

  function getLocaleLabel(locale) {
    return localeConfigs[locale].label;
  }

  // TODO Docusaurus should expose this unlocalized baseUrl more reliably?
  const baseUrlUnlocalized =
    currentLocale === defaultLocale
      ? baseUrl
      : baseUrl.replace(`/${currentLocale}/`, '/');

  const pathnameSuffix = pathname.replace(baseUrl, '');

  function getLocalizedBaseUrl(locale) {
    return locale === defaultLocale
      ? `${baseUrlUnlocalized}`
      : `${baseUrlUnlocalized}${locale}/`;
  }

  const localeItems = locales.map((locale) => {
    const to = `${getLocalizedBaseUrl(locale)}${pathnameSuffix}`;
    return {
      isNavLink: true,
      label: getLocaleLabel(locale),
      to: `pathname://${to}`,
      target: '_self',
      autoAddBaseUrl: false,
      className: locale === currentLocale ? 'dropdown__link--active' : '',
    };
  });

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter];

  // Mobile is handled a bit differently
  const dropdownLabel = mobile ? 'Languages' : getLocaleLabel(currentLocale);

  return (
    <DefaultNavbarItem
      {...props}
      mobile={mobile}
      label={
        <span>
          <IconLanguage
            style={{verticalAlign: 'text-bottom', marginRight: 5}}
          />
          <span>{dropdownLabel}</span>
        </span>
      }
      items={items}
    />
  );
}
