/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

export default class NotFound extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <div>404 Page Not Found</div>
        <div>
          <img
            alt="Not found"
            src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX3889253.jpg"
          />
        </div>
      </Layout>
    );
  }
}
