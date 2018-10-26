/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export default props => {
  if (props.error) {
    return <div align="center">Error</div>;
  }
  if (props.pastDelay) {
    return <div align="center">Loading...</div>;
  }
  return null;
};
