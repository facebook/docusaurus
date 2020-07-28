/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, useState} from 'react';
import styles from './style.module.css';
import Fuse from 'fuse.js';
import {groupBy, sortBy} from 'lodash-es';

const results = [];

const ELEMENTS = {
  h1: 30,
  h2: 20,
  h3: 10,
  p: 5,
};

const score = (elements) =>
  elements.reduce((acc, cur) => acc + ELEMENTS[cur.type], 0);

const sortType = (data) => sortBy(data, 'type');
function rank(list) {
  const result = list.slice(0, 20);
  const data = groupBy(result, 'pageID');
  const ranked = sortBy(
    Object.entries(data).map(([key, value]) => ({
      key,
      value: score(value),
    })),
    'value',
  ).reverse();
  return ranked.map(({key}) => ({key, value: sortType(data[key])}));
}

export default function () {
  const [data, setData] = useState([]);
  const fuse = useMemo(() => {
    return new Fuse(results, {
      keys: ['body'],
      minMatchCharLength: 3,
      location: true,
    });
  });
  return (
    <div className="navbar__items--right">
      <div className={styles.overlay}>
        <div className={`${styles.modal} shadow--lw`}>
          <div>
            <input
              onChange={(event) => {
                const d = rank(
                  fuse.search(event.target.value).map((v) => v.item),
                );
                setData(d);
              }}
            />
            <div className={styles.result}>
              {data.map((v) => {
                return (
                  <div>
                    {v.value.map((g) => (
                      <div>{g.body}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
