/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import {useQueryStringSearchName} from '@site/src/pages/showcase/_utils';
import styles from './styles.module.css';

export default function ShowcaseSearchBar(): ReactNode {
  // TODO need to optimize these slow QS updates
  const [searchName, setSearchName] = useQueryStringSearchName();
  return (
    <div className={styles.searchBar}>
      <input
        placeholder={translate({
          message: 'Search for site name...',
          id: 'showcase.searchBar.placeholder',
        })}
        value={searchName}
        onInput={(e) => {
          setSearchName(e.currentTarget.value);
        }}
      />
    </div>
  );
}
