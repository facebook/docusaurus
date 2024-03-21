/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Showcase';
import Layout from '@theme/Layout';

export default function Showcase(props: Props): JSX.Element {
  return (
    <Layout title="Showcase">
      <div>Content for Showcase</div>
      <div>{props.content.author}</div>
      <div>{props.content.title}</div>
    </Layout>
  );
}
