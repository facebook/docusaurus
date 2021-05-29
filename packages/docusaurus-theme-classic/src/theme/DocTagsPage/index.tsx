/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
// TODO add Link
import Link from '@docusaurus/Link';
// import DocPage from '@theme/DocPage';
// import Link from '@docusaurus/Link';

// TODO add TS types later
// import type {Props} from '@theme/DocPage';
type Props = {
  tag: {name: string; permalink: string; docIds: string[]; allTagsPath: string};
};

// TODO add Sidebar later
// import DocSidebar from '@theme/DocSidebar';

function pluralize(count: number, word: string) {
  return count > 1 ? `${word}s` : word;
}

function DocTagsPage({tag}: Props): JSX.Element {
  // const {versionMetadata, location, route:{routes: docRoutes}} = props;
  // const {
  //   label,
  // } = props;
  // //const {allTagsPath, name: tagName, count} = versionMetadata;
  // //const {pluginId, version, docsSidebars, label, isLast, permalinkToSidebar} = versionMetadata;
  // const {label} = versionMetadata;
  // const label = "Label";
  console.log('tag information is,');
  console.log(tag);

  const tagsSection = <h3>{tag.name}</h3>;

  return (
    <Layout title={`Tags tagged "${tag.name}"`} description="Doc Tags">
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <h1>
              {pluralize(tag.docIds.length, 'doc')} tagged with &quot;{tag.name}
              &quot;
            </h1>
            <Link href={tag.allTagsPath}>View All Tags</Link>
            <div className="margin-vert--lg">{tagsSection}</div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocTagsPage;
