/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import type {Props} from '@theme/BlogPostPage';
import BlogSidebar from '@theme/BlogSidebar';
import TOC from '@theme/TOC';
import {ThemeClassNames} from '@docusaurus/theme-common';

function BlogPostPage(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {frontMatter, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem} = metadata;
  const {hide_table_of_contents: hideTableOfContents} = frontMatter;

  return (
    <Layout
      title={title}
      description={description}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogPostPage}>
      {BlogPostContents && (
        <div className="container margin-vert--lg">
          <div className="row">
            <aside className="col col--3">
              <BlogSidebar sidebar={sidebar} />
            </aside>
            <main className="col col--7">
              <BlogPostItem
                frontMatter={frontMatter}
                metadata={metadata}
                isBlogPostPage>
                <BlogPostContents />
              </BlogPostItem>
              {(nextItem || prevItem) && (
                <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
              )}
            </main>
            {!hideTableOfContents && BlogPostContents.toc && (
              <div className="col col--2">
                <TOC toc={BlogPostContents.toc} />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
