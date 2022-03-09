/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import Link from '@docusaurus/Link';
import {
  type FooterLinkItem,
  useThemeConfig,
  type MultiColumnFooter,
  type SimpleFooter,
} from '@docusaurus/theme-common';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import IconExternalLink from '@theme/IconExternalLink';

function FooterLink({
  to,
  href,
  label,
  prependBaseUrlToHref,
  ...props
}: FooterLinkItem) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});

  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      <span>
        {label}
        {href && !isInternalUrl(href) && <IconExternalLink />}
      </span>
    </Link>
  );
}

function FooterLogo({logo}: {logo: SimpleFooter['logo']}) {
  const {withBaseUrl} = useBaseUrlUtils();
  if (!logo?.src) {
    return null;
  }
  const sources = {
    light: withBaseUrl(logo.src),
    dark: withBaseUrl(logo.srcDark ?? logo.src),
  };
  const image = (
    <ThemedImage
      className="footer__logo"
      alt={logo.alt}
      sources={sources}
      width={logo.width}
      height={logo.height}
    />
  );
  return (
    <div className="margin-bottom--sm">
      {logo.href ? (
        <Link href={logo.href} className={styles.footerLogoLink}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}

function MultiColumnLinks({links}: {links: MultiColumnFooter['links']}) {
  return (
    <>
      {links.map((linkItem, i) => (
        <div key={i} className="col footer__col">
          <div className="footer__title">{linkItem.title}</div>
          <ul className="footer__items">
            {linkItem.items.map((item, key) =>
              item.html ? (
                <li
                  key={key}
                  className="footer__item"
                  // Developer provided the HTML, so assume it's safe.
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: item.html,
                  }}
                />
              ) : (
                <li key={item.href || item.to} className="footer__item">
                  <FooterLink {...item} />
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </>
  );
}

function SimpleLinks({links}: {links: SimpleFooter['links']}) {
  return (
    <div className="footer__links">
      {links.map((item, key) => (
        <React.Fragment key={key}>
          {item.html ? (
            <span
              className="footer__link-item"
              // Developer provided the HTML, so assume it's safe.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: item.html,
              }}
            />
          ) : (
            <FooterLink {...item} />
          )}
          {links.length !== key + 1 && (
            <span className="footer__link-separator">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

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
            <div className="row footer__links">
              <MultiColumnLinks links={links} />
            </div>
          ) : (
            <div className="footer__links text--center">
              <SimpleLinks links={links} />
            </div>
          ))}
        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            <FooterLogo logo={logo} />
            {copyright && (
              <div
                className="footer__copyright"
                // Developer provided the HTML, so assume it's safe.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: copyright,
                }}
              />
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

export default React.memo(Footer);
