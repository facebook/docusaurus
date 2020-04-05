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

function BlogPostPage(props) {
  const {content: BlogPostContents} = props;
  const {frontMatter, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem, editUrl} = metadata;

  return (
    <Layout title={title} description={description}>
      {BlogPostContents && (
        <div className="container">
          <div className="row">
            <div className="col offset-2">
              <BlogPostItem
                frontMatter={frontMatter}
                metadata={metadata}
                isBlogPostPage>
                <BlogPostContents />
              </BlogPostItem>
              <div className="my-4">
                {editUrl && (
                  <a href={editUrl} target="_blank" rel="noreferrer noopener">
                    <svg
                      fill="currentColor"
                      height="1.2em"
                      width="1.2em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 40 40"
                      style={{
                        marginRight: '0.3em',
                        verticalAlign: 'sub',
                      }}>
                      <g>
                        <path d="m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z" />
                      </g>
                    </svg>
                    Edit this page
                  </a>
                )}
              </div>
              {(nextItem || prevItem) && (
                <div className="mx-xl">
                  <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
