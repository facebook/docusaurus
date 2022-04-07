/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Helmet} from 'react-helmet-async';
import type {Props} from '@docusaurus/Head';

export default function Head(props: Props): JSX.Element {
  return <Helmet {...props} />;
}
