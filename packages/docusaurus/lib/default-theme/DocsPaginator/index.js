/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Link from '@docusaurus/Link';

import DocusaurusContext from '@docusaurus/context';

function DocsPaginator() {
  const context = useContext(DocusaurusContext);
  const {docsMetadata, metadata} = context;
  if (!metadata || !docsMetadata) {
    return null;
  }
  const {docs} = docsMetadata;

  return (
    <div className="row">
      <div className="col col--6">
        {metadata.previous && docs[metadata.previous] && (
          <Link
            className="button button--secondary"
            to={docs[metadata.previous].permalink}>
            <i className="fas fa-arrow-left" />
            &nbsp;&nbsp;
            {metadata.previous_title}
          </Link>
        )}
      </div>
      <div className="col col--6 text--right">
        {metadata.next && docs[metadata.next] && (
          <Link
            className="button button--secondary"
            to={docs[metadata.next].permalink}>
            {metadata.next_title}&nbsp;&nbsp;
            <i className="fas fa-arrow-right" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default DocsPaginator;
