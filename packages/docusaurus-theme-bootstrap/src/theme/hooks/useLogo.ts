/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useThemeContext from '@theme/hooks/useThemeContext';
import type {LogoLinkProps, useLogoReturns} from '@theme/hooks/useLogo';

const useLogo = (): useLogoReturns => {
  const {
    siteConfig: {themeConfig: {navbar: {logo = {}} = {}} = {}} = {},
  } = useDocusaurusContext();
  const {isDarkTheme} = useThemeContext();
  const logoLink = useBaseUrl(logo.href || '/');
  let logoLinkProps: LogoLinkProps = {};

  if (logo.target) {
    logoLinkProps = {target: logo.target};
  } else if (!isInternalUrl(logoLink)) {
    logoLinkProps = {
      rel: 'noopener noreferrer',
      target: '_blank',
    };
  }

  const logoSrc = logo.srcDark && isDarkTheme ? logo.srcDark : logo.src;
  const logoImageUrl = useBaseUrl(logoSrc);

  return {
    logoLink,
    logoLinkProps,
    logoImageUrl,
    logoAlt: logo.alt,
  };
};

export default useLogo;
