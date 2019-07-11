/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import DocLegacyPaginator from '@theme/DocLegacyPaginator';

import styles from './styles.module.css';

function Headings({headings, isChild}) {
  if (!headings.length) return null;
  return (
    <ul className={isChild ? '' : 'contents contents__left-border'}>
      {headings.map(heading => (
        <li key={heading.id}>
          <a href={`#${heading.id}`} className="contents__link">
            {heading.value}
          </a>
          <Headings isChild headings={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function DocLegacyItem(props) {
  const {metadata, content: DocContent, docsMetadata} = props;

  return (
    <div>
      <Head>
        {metadata && metadata.title && <title>{metadata.title}</title>}
      </Head>
      <div className="padding-vert--lg">
        <div className="row">
          <div className="col">
            <div className={styles.docItemContainer}>
              <header>
                <h1 className="margin-bottom--lg">{metadata.title}</h1>
              </header>
              <article>
                <div className="markdown">
                  <DocContent />
                </div>
              </article>
              <div className="margin-top--xl margin-bottom--lg">
                <DocLegacyPaginator
                  docsMetadata={docsMetadata}
                  metadata={metadata}
                />
              </div>
            </div>
          </div>
          {DocContent.rightToc && (
            <div className="col col--3">
              <div className={styles.tableOfContents}>
                <Headings headings={DocContent.rightToc} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocLegacyItem;
