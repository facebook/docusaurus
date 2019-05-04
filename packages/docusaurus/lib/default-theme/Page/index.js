/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout'; // eslint-disable-line

function Page(props) {
  const {content: PageContent} = props;
  return (
    <Layout>
      <PageContent />
    </Layout>
  );
}

export default Page;
