/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

function MDXPage(props) {
  const {content: MDXPageContent} = props;
  const {frontMatter, metadata} = MDXPageContent;
  const {title, description} = frontMatter;
  const {permalink} = metadata;

  return (
    <Layout title={title} description={description} permalink={permalink}>
      <main>
        <div className="container margin-vert--lg padding-vert--lg">
          <MDXPageContent />
        </div>
      </main>
    </Layout>
  );
}

export default MDXPage;
