/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import {useThemeConfig} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import TOC from '@theme/TOC';

import type {Props} from '@theme/BlogLayout';

function BlogLayout(props: Props): JSX.Element {
  const {
    sidebar,
    toc,
    children,
    tocMinHeadingLevel,
    tocMaxHeadingLevel,
    ...layoutProps
  } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const {tableOfContents} = useThemeConfig();

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {hasSidebar && (
            <aside className="col col--3">
              <BlogSidebar sidebar={sidebar!} />
            </aside>
          )}
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="http://schema.org/Blog">
            {children}
          </main>
          {toc && (
            <div className="col col--2">
              <TOC
                toc={toc}
                minHeadingLevel={tocMinHeadingLevel}
                maxHeadingLevel={
                  tocMaxHeadingLevel ?? tableOfContents.maxHeadingLevel
                }
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default BlogLayout;
