/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import type {Props} from '@theme/Footer/Logo';

function LogoImage({logo}: Props) {
  const {withBaseUrl} = useBaseUrlUtils();
  const sources = {
    light: withBaseUrl(logo.src),
    dark: withBaseUrl(logo.srcDark ?? logo.src),
  };
  return (
    <ThemedImage
      className="footer__logo"
      alt={logo.alt}
      sources={sources}
      width={logo.width}
      height={logo.height}
    />
  );
}

export default function FooterLogo({logo}: Props): JSX.Element {
  return logo.href ? (
    <Link href={logo.href} className={styles.footerLogoLink}>
      <LogoImage logo={logo} />
    </Link>
  ) : (
    <LogoImage logo={logo} />
  );
}
