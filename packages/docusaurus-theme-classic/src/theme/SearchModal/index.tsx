/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import styles from './style.module.css';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import {useSearch} from '@theme/useSearch';

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
export default function ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: () => void;
}): JSX.Element {
  const [data, setData] = useState([] as Array<any>);
  React.useEffect(() => {
    setData([]);
  }, [isOpen, setData]);
  const search = useSearch();
  return isOpen ? (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={styles.overlay}>
      {/* eslint-disable-next-line */}
      <div
        className={`${styles.overlay} ${styles.overlay_colored}`}
        onClick={setOpen}
      />
      <div className={`${styles.modal} card shadow--tl`}>
        <div className={`${styles.header} card__header`}>
          <div className="navbar__search">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              placeholder="search"
              className="navbar__search-input"
              onChange={(event) => {
                search(event.target.value).then((v) => setData(v));
              }}
            />
          </div>
          <button
            className={`button button--outline button--primary ${styles.close_button}`}
            onClick={setOpen}
            type="button">
            close
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
    <></>
  );
}
