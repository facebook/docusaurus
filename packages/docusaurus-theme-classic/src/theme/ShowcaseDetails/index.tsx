/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@theme/ShowcaseDetails';
import Layout from '@theme/Layout';

export default function Showcase(props: Props): JSX.Element {
  const user = props.content;

  return (
    <Layout title="Showcase Details">
      <div>{user.title}</div>
    </Layout>
  );
}
