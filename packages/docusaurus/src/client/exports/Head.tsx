/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Helmet} from 'react-helmet';
import type {HeadProps} from '@docusaurus/Head';

function Head(props: HeadProps): JSX.Element {
  return <Helmet {...props} />;
}

export default Head;
