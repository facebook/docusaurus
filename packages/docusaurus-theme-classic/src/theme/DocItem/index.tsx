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
import {MainHeading} from '@theme/Heading';

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

  // We only add a title if:
  // - user asks to hide it with frontmatter
  // - the markdown content does not already contain a top-level h1 heading
  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === 'undefined';

  const showToc = !hideTableOfContents && DocContent.toc;

  const {isDesktop} = useWindowSize();
  const mobileTocRef = useRef(null);
  const [collapsed, setCollapsed] = useCollapse(true, mobileTocRef);

  return (
    <>
      <Seo {...{title, description, keywords, image}} />

      <div className="row">
        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}>
          <DocVersionSuggestions />
          <div className={styles.docItemContainer}>
            <article>
              {showVersionBadge && (
                <span className="badge badge--secondary">
                  Version: {version.label}
                </span>
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

              <div className="markdown">
                {/*
                Title can be declared inside md content or declared through frontmatter and added manually
                To make both cases consistent, the added title is added under the same div.markdown block
                See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                */}
                {shouldAddTitle && <MainHeading>{title}</MainHeading>}

                <DocContent />
              </div>

              {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                <footer className={clsx('row', styles.docUpdateDetails)}>
                  <div className="col">
                    {editUrl && <EditThisPage editUrl={editUrl} />}
                  </div>

                  <div className={clsx('col', styles.lastUpdated)}>
                    {(lastUpdatedAt || lastUpdatedBy) && (
                      <LastUpdated
                        lastUpdatedAt={lastUpdatedAt}
                        formattedLastUpdatedAt={formattedLastUpdatedAt}
                        lastUpdatedBy={lastUpdatedBy}
                      />
                    )}
                  </div>
                </footer>
              )}
            </article>

            <div className={styles.docPaginator}>
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
