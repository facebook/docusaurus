/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext, useEffect} from 'react';

import DocsPaginator from '@theme/DocsPaginator'; // eslint-disable-line
import DocusaurusContext from '@docusaurus/context';

import styles from './styles.module.css';

function DocBody(props) {
  const {metadata, modules} = props;
  const context = useContext(DocusaurusContext);
  useEffect(() => {
    context.setContext({metadata});
  }, []);

  const DocContents = modules[0];

  return (
    <div>
      <div className={styles.docContent}>
        <h1>{metadata.title}</h1>
        <DocContents />
      </div>
      <div className={styles.paginatorContainer}>
        <DocsPaginator />
      </div>
    </div>
  );
}

export default DocBody;
