/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// TODO add TS types later
// import type {Props} from '@theme/DocTagsListPage';
type Props = {
  tag: Record<string, string | string[]>;
  versionPath: Record<'versionPath', string>;
};

function DocTagsListPage({tag, versionPath}: Props): JSX.Element {
  return (
    <Layout title={`${tag.name} Tag`} description={`${tag.name} Tag`}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <h1>{tag.name} Tag</h1>
            <div className="margin-vert--lg">
              <p>Documentation pages:</p>
              <ul>
                {(tag.docIds as string[]).map((page) => (
                  <>
                    <span>-</span>
                    <Link
                      key={page}
                      to={`${versionPath.versionPath
                        .split('/')
                        .pop()}/${page}`}>
                      A page
                    </Link>
                  </>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocTagsListPage;
