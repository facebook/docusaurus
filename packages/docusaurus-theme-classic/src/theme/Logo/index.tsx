/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Logo';

import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';

const Logo = (props: Props): JSX.Element => {
  const {isClient} = useDocusaurusContext();
  const {
    navbar: {title, logo = {src: ''}},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo.href || '/');
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };

  return (
    <Link
      to={logoLink}
      {...propsRest}
      {...(logo.target && {target: logo.target})}>
      {logo.src && (
        <ThemedImage
          key={isClient}
          className={imageClassName}
          sources={sources}
          alt={logo.alt || title || 'Logo'}
        />
      )}
      {title != null && <strong className={titleClassName}>{title}</strong>}
    </Link>
  );
};

export default Logo;
