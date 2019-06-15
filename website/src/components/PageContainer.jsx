/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';

export default ({children, description, title}) => (
  <Layout description={description} title={title}>
    <div className="container margin-vert--xl">
      <div className="row">
        <div className="col col--8 col--offset-2">{children}</div>
      </div>
    </div>
  </Layout>
);
