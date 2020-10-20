/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import type {Props} from '@theme/MDXPage';
import TOC from '@theme/TOC';

function MDXPage(props: Props): JSX.Element {
  const {content: MDXPageContent} = props;
  const {frontMatter, metadata} = MDXPageContent;

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
      wrapperClassName={wrapperClassName}>
      <main>
        <div className="container container--fluid">
          <div className="margin-vert--lg padding-vert--lg">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <div className="container">
                  <MDXProvider components={MDXComponents}>
                    <MDXPageContent />
                  </MDXProvider>
                </div>
              </div>
              {!hideTableOfContents && MDXPageContent.rightToc && (
                <div className="col col--2">
                  <TOC headings={MDXPageContent.rightToc} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default MDXPage;
