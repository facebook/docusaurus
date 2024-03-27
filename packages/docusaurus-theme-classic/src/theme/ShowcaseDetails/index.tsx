/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@theme/ShowcaseDetails';
import Layout from '@theme/Layout';

export default function Showcase(props: Props): JSX.Element {
  const {content: MDXPageContent} = props;
  const {title, description} = MDXPageContent;

  return (
    <Layout title="Showcase Details">
      <div>Title {JSON.stringify(title)}</div>
      <div>Description {JSON.stringify(description)}</div>
    </Layout>
  );
}
