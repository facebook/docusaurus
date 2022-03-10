/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import {
  useThemeConfig,
  type MultiColumnFooter,
  type SimpleFooter,
} from '@docusaurus/theme-common';
import Logo from '@theme/Footer/Logo';
import Copyright from '@theme/Footer/Copyright';
import MultiColumn from '@theme/Footer/MultiColumn';
import Simple from '@theme/Footer/Simple';

function isMultiColumnFooterLinks(
  links: MultiColumnFooter['links'] | SimpleFooter['links'],
): links is MultiColumnFooter['links'] {
  return 'title' in links[0]!;
}

function Footer(): JSX.Element | null {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }
  const {copyright, links, logo} = footer;

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': footer.style === 'dark',
      })}>
      <div className="container container-fluid">
        {links &&
          links.length > 0 &&
          (isMultiColumnFooterLinks(links) ? (
            <MultiColumn columns={links} />
          ) : (
            <Simple links={links} />
          ))}
        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            {logo && (
              <div className="margin-bottom--sm">
                <Logo logo={logo} />
              </div>
            )}
            {copyright && <Copyright copyright={copyright} />}
          </div>
        )}
      </div>
    </footer>
  );
}

export default React.memo(Footer);
