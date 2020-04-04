/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';
import EditPage from '@theme/EditPage';

import classnames from 'classnames';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'contents__link';
const ACTIVE_LINK_CLASS_NAME = 'contents__link--active';
const TOP_OFFSET = 100;

function DocTOC({headings}) {
  useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);
  return (
    <div className="col col--3">
      <div className={styles.tableOfContents}>
        <Headings headings={headings} />
      </div>
    </div>
  );
}

/* eslint-disable jsx-a11y/control-has-associated-label */
function Headings({headings, isChild}) {
  if (!headings.length) {
    return null;
  }
  return (
    <ul className={isChild ? '' : 'contents contents__left-border'}>
      {headings.map(heading => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={LINK_CLASS_NAME}
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <Headings isChild headings={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function DocItem(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {url: siteUrl, title: siteTitle} = siteConfig;
  const {content: DocContent} = props;
  const {metadata} = DocContent;
  const {
    description,
    title,
    permalink,
    editUrl,
    lastUpdatedAt,
    lastUpdatedBy,
    version,
  } = metadata;
  const {
    frontMatter: {
      image: metaImage,
      keywords,
      hide_title: hideTitle,
      hide_table_of_contents: hideTableOfContents,
    },
  } = DocContent;

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta name="keywords" content={keywords.join(',')} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${title}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
      </Head>
      <div className="padding-vert--lg">
        <div className="container">
          <div className="row">
            <div className={classnames('col', styles.docItemCol)}>
              <div className={styles.docItemContainer}>
                <article>
                  {version && (
                    <div>
                      <span className="badge badge--secondary">
                        Version: {version}
                      </span>
                    </div>
                  )}
                  {!hideTitle && (
                    <header>
                      <h1 className={styles.docTitle}>{title}</h1>
                    </header>
                  )}
                  <div className="markdown">
                    <DocContent />
                  </div>
                </article>
                {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                  <div className="margin-vert--xl">
                    <div className="row">
                      <div className="col">
                        <EditPage editUrl={editUrl} />
                      </div>
                      {(lastUpdatedAt || lastUpdatedBy) && (
                        <div className="col text--right">
                          <em>
                            <small>
                              Last updated{' '}
                              {lastUpdatedAt && (
                                <>
                                  on{' '}
                                  <time
                                    dateTime={new Date(
                                      lastUpdatedAt * 1000,
                                    ).toISOString()}
                                    className={styles.docLastUpdatedAt}>
                                    {new Date(
                                      lastUpdatedAt * 1000,
                                    ).toLocaleDateString()}
                                  </time>
                                  {lastUpdatedBy && ' '}
                                </>
                              )}
                              {lastUpdatedBy && (
                                <>
                                  by <strong>{lastUpdatedBy}</strong>
                                </>
                              )}
                              {process.env.NODE_ENV === 'development' && (
                                <div>
                                  <small>
                                    {' '}
                                    (Simulated during dev for better perf)
                                  </small>
                                </div>
                              )}
                            </small>
                          </em>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="margin-vert--lg">
                  <DocPaginator metadata={metadata} />
                </div>
              </div>
            </div>
            {!hideTableOfContents && DocContent.rightToc && (
              <DocTOC headings={DocContent.rightToc} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DocItem;
