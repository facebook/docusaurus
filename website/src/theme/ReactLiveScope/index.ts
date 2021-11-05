/**
 * Copyright (c) Meta. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import * as components from './components';

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...components,
};

export default ReactLiveScope;
