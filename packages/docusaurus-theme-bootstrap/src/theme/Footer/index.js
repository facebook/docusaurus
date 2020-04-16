/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

function FooterLink({to, href, label, ...props}) {
  const toUrl = useBaseUrl(to);

  return (
    <Link
      {...(href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}
    </Link>
  );
}

function Footer() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {themeConfig = {}} = siteConfig;
  const {footer} = themeConfig;

  const {links} = footer || {};

  return (
    <footer className="container p-0">
      <div className="row bg-light no-gutters justify-content-center">
        {links && links.length > 0 && (
          <>
            {links.map((linkItem, i) => (
              <div className="col col-xs-1 col-xl-1 mx-4 my-5" key={i}>
                {linkItem.title != null && <h5>{linkItem.title}</h5>}
                <ul className="list-unstyled">
                  {linkItem.items.map((item, key) =>
                    item.html ? (
                      <li
                        key={key}
                        className="mb-2"
                        dangerouslySetInnerHTML={{
                          __html: item.html,
                        }}
                      />
                    ) : (
                      <li className="mb-1" key={item.href || item.to}>
                        <FooterLink {...item} />
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
