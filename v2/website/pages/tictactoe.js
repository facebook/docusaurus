/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Helmet from 'react-helmet';
import Tictactoe from '@site/components/Tictactoe';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Tic Tac Toe</title>
        </Helmet>
        <Tictactoe />
      </div>
    );
  }
}
