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

function MDXPage(props: Props): JSX.Element {
  const {content: MDXPageContent} = props;
  const {frontMatter, metadata} = MDXPageContent;
  const {title, description, wrapperClassName} = frontMatter;
  const {permalink} = metadata;

  return (
    <Layout
      title={title}
      description={description}
      permalink={permalink}
      wrapperClassName={wrapperClassName}>
      <main>
        <div className="container margin-vert--lg padding-vert--lg">
          <MDXProvider components={MDXComponents}>
            <MDXPageContent />
          </MDXProvider>
        </div>
      </main>
    </Layout>
  );
}

export default MDXPage;
