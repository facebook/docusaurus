/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import {useHistory, useLocation} from '@docusaurus/router';
import {readSearchName, setSearchName} from '../../_utils';

import styles from './styles.module.css';

export default function ShowcaseSearchBar(): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    setValue(readSearchName(location.search) ?? '');
  }, [location]);
  return (
    <div className={styles.searchBar}>
      <input
        placeholder={translate({
          message: 'Search for site name...',
          id: 'showcase.searchBar.placeholder',
        })}
        value={value}
        onInput={(e) => {
          const name = e.currentTarget.value;
          setValue(name);
          const newSearch = setSearchName(location.search, name);
          history.replace({
            ...location,
            search: newSearch,
          });
        }}
      />
    </div>
  );
}
