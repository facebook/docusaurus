/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import type {Props} from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

export default function LocaleDropdownNavbarItem({
  mobile,
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

  //  TODO Docusaurus expose this unlocalized baseUrl more reliably
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

  const items = locales.map((locale) => {
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

  // Mobile is handled a bit differently
  const dropdownLabel = mobile ? 'Languages' : getLocaleLabel(currentLocale);

  return (
    <DefaultNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      items={items}
    />
  );
}
