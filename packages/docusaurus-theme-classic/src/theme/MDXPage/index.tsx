/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import type {Props} from '@theme/MDXPage';
import TOC from '@theme/TOC';
import {ThemeClassNames} from '@docusaurus/theme-common';

import styles from './styles.module.css';

function MDXPage(props: Props): JSX.Element {
  const {content: MDXPageContent} = props;
  const {
    // TODO this frontmatter is not validated/normalized, it's the raw user-provided one. We should expose normalized one too!
    frontMatter,
    metadata,
  } = MDXPageContent;

  const {
    title,
    description,
    wrapperClassName,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const {permalink} = metadata;

  return (
    <Layout
      title={title}
      description={description}
      permalink={permalink}
      wrapperClassName={wrapperClassName ?? ThemeClassNames.wrapper.mdxPages}
      pageClassName={ThemeClassNames.page.mdxPage}>
      <main className="container container--fluid margin-vert--lg">
        <div className={clsx('row', styles.mdxPageWrapper)}>
          <div className={clsx('col', !hideTableOfContents && 'col--8')}>
            <MDXProvider components={MDXComponents}>
              <MDXPageContent />
            </MDXProvider>
          </div>
          {!hideTableOfContents && MDXPageContent.toc && (
            <div className="col col--2">
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default MDXPage;
