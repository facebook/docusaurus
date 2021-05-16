/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef} from 'react';
import clsx from 'clsx';

import {
  useActivePlugin,
  useVersions,
  useActiveVersion,
} from '@theme/hooks/useDocs';
import useCollapse from '@theme/hooks/useCollapse';
import useWindowSize from '@theme/hooks/useWindowSize';
import DocPaginator from '@theme/DocPaginator';
import DocVersionSuggestions from '@theme/DocVersionSuggestions';
import Seo from '@theme/Seo';
import LastUpdated from '@theme/LastUpdated';
import type {Props} from '@theme/DocItem';
import TOC, {Headings} from '@theme/TOC';
import EditThisPage from '@theme/EditThisPage';

import styles from './styles.module.css';

function DocItem(props: Props): JSX.Element {
  const {content: DocContent} = props;
  const {metadata, frontMatter} = DocContent;
  const {
    image,
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const {
    description,
    title,
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
  } = metadata;

  const {pluginId} = useActivePlugin({failfast: true});
  const versions = useVersions(pluginId);
  const version = useActiveVersion(pluginId);

  // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362
  const showVersionBadge = versions.length > 1;

  // For meta title, using frontMatter.title in priority over a potential # title found in markdown
  // See https://github.com/facebook/docusaurus/issues/4665#issuecomment-825831367
  const metaTitle = frontMatter.title || title;

  const showToc = !hideTableOfContents && DocContent.toc;

  const {isDesktop} = useWindowSize();
  const mobileTocRef = useRef(null);
  const [collapsed, setCollapsed] = useCollapse(true, mobileTocRef);

  return (
    <>
      <Seo {...{title: metaTitle, description, keywords, image}} />

      <div className="row">
        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}>
          <DocVersionSuggestions />
          <div className={styles.docItemContainer}>
            <article>
              {showVersionBadge && (
                <div>
                  <span className="badge badge--secondary">
                    Version: {version.label}
                  </span>
                </div>
              )}
              {!isDesktop && showToc && (
                <div
                  className={clsx('margin-vert--md', styles.mobileToc, {
                    [styles.mobileTocExpanded]: !collapsed,
                  })}>
                  <button
                    type="button"
                    className={styles.mobileTocButton}
                    onClick={() => setCollapsed(!collapsed)}>
                    Contents of this page
                  </button>

                  <div
                    ref={mobileTocRef}
                    className={clsx(styles.mobileTocContent)}>
                    <Headings toc={DocContent.toc} />
                  </div>
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
                    {editUrl && <EditThisPage editUrl={editUrl} />}
                  </div>
                  {(lastUpdatedAt || lastUpdatedBy) && (
                    <LastUpdated
                      lastUpdatedAt={lastUpdatedAt}
                      formattedLastUpdatedAt={formattedLastUpdatedAt}
                      lastUpdatedBy={lastUpdatedBy}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="margin-vert--lg">
              <DocPaginator metadata={metadata} />
            </div>
          </div>
        </div>
        {showToc && isDesktop && (
          <div className="col col--3">
            <TOC toc={DocContent.toc} />
          </div>
        )}
      </div>
    </>
  );
}

export default DocItem;
