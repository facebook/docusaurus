/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import styles from './style.module.css';
import {groupBy, sortBy} from 'lodash-es';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

const ELEMENTS = {
  h1: 3,
  h2: 2,
  h3: 1,
  p: 0.5,
};

const ALLOWED = 30;
const formatString = (match, str) => {
  const [start, end] = match.indices[0];
  const length = end - start;
  const strChunks = [
    str.substr(0, start),
    str.substr(start, length + 1),
    str.substr(end + 1),
  ];
  if (str.length < ALLOWED) {
    return (
      <span>
        {strChunks[0]}
        <span className={styles.highlight}>{strChunks[1]}</span>
        {strChunks[2]}
      </span>
    );
  }
  if (start > ALLOWED) {
    return (
      <span>
        ...
        <span className={styles.highlight}>{strChunks[1]}</span>
        {strChunks[2]}
      </span>
    );
  }
  if (start < ALLOWED) {
    return (
      <span>
        {strChunks[0]}
        <span className={styles.highlight}>{strChunks[1]}</span>
        {strChunks[2].slice(0, ALLOWED - strChunks[0].length)}...
      </span>
    );
  }
  return str;
};

function ListItem({page, dataNode, setOpen}) {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <li className={`shadow--lw ${styles.search_item}`} onClick={setOpen}>
      <Link
        className={styles.data_node}
        to={withBaseUrl(`${page.key}#${dataNode.anchor}`)}>
        {formatString(dataNode.match[0], dataNode.body)}
      </Link>
    </li>
  );
}

const score = (elements) =>
  elements.reduce((acc, cur) => acc + (1 - cur.score) * ELEMENTS[cur.type], 0);

const sortType = (data) => sortBy(data, 'type');

const rank = (list) => {
  const result = list.slice(0, 100).filter((v) => v.score < 0.5);
  const data = groupBy(
    result.map((v) => ({...v.item, match: v.matches})),
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
  const [searchTerm, setSearchTerm] = useState('');
  const data = React.useMemo(() => {
    return fuse ? rank(fuse.search(searchTerm)) : [];
  }, [fuse, searchTerm]);
  return isOpen ? (
    <div className={styles.overlay}>
      <div className={`${styles.modal} card shadow--tl`}>
        <div className={`${styles.header} card__header`}>
          <div className="navbar__search">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="navbar__search-input"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
          <button
            className="button button--primary "
            onClick={setOpen}
            type="button">
            Close
          </button>
        </div>
        <div className={`${styles.result} card__body`}>
          {data.map((page, pageIndex) => {
            return [
              <div className={styles.page}>{page.value[0].heading}</div>,
              <ul className={styles.group}>
                {page.value.map((dataNode, nodeIndex) => (
                  <ListItem
                    setOpen={setOpen}
                    dataNode={dataNode}
                    page={page}
                    key={`${pageIndex}-${nodeIndex}`}
                  />
                ))}
              </ul>,
            ];
          })}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}
