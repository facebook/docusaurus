/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import type {Props} from '@theme/BlogPostPage';
import {ThemeClassNames} from '@docusaurus/theme-common';

function BlogPostPage(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {frontMatter, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem} = metadata;
  const {hide_table_of_contents: hideTableOfContents} = frontMatter;

  return (
    <BlogLayout
      title={title}
      description={description}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogPostPage}
      sidebar={sidebar}
      toc={
        !hideTableOfContents && BlogPostContents.toc
          ? BlogPostContents.toc
          : undefined
      }>
      <BlogPostItem
        frontMatter={frontMatter}
        metadata={metadata}
        isBlogPostPage>
        <BlogPostContents />
      </BlogPostItem>
      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  );
}

export default BlogPostPage;
