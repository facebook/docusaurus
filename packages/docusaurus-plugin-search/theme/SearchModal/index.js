/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import styles from './style.module.css';
import {groupBy, sortBy} from 'lodash-es';
import {useHistory} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

const ELEMENTS = {
  h1: 30,
  h2: 20,
  h3: 10,
  p: 5,
};

const score = (elements) =>
  elements.reduce((acc, cur) => acc + ELEMENTS[cur.type], 0);

const sortType = (data) => sortBy(data, 'type');

const rank = (list) => {
  const result = list.slice(0, 100).filter((v) => v.score < 0.5);
  const data = groupBy(
    result.map((v) => ({...v.item, ...v.matches})),
    'pageID',
  );
  const ranked = sortBy(
    Object.entries(data).map(([key, value]) => ({
      key,
      value: score(value),
    })),
    'value',
  ).reverse();
  return ranked.map(({key}) => ({key, value: sortType(data[key])}));
};
export default function ({fuse, isOpen, setOpen}) {
  const {withBaseUrl} = useBaseUrlUtils();
  const history = useHistory();
  const [data, setData] = useState([]);
  const handleClick = useCallback((url) => {
    setOpen(false);
    setData([]);
    history.push(withBaseUrl(url));
  });
  return isOpen ? (
    <div className={styles.overlay}>
      <div className={`${styles.modal} shadow--lw`}>
        <div className={styles.search}>
          <input
            className={styles.search_input}
            onChange={(event) => {
              setData(rank(fuse.search(event.target.value)));
            }}
          />
        </div>
        <div className={styles.result}>
          {data.map((page) => {
            return (
              <ul className={styles.group}>
                {page.value.map((dataNode) => (
                  <li className={`shadow--tl ${styles.search_item}`}>
                    <button
                      className={styles.data_node}
                      type="button"
                      onClick={() =>
                        handleClick(`${page.key}#${dataNode.anchor}`)
                      }>
                      {dataNode.body.slice(0, 40)}
                    </button>
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}
