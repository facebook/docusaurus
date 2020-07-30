/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

import Modal from '../SearchModal';

import Fuse from 'fuse.js';

export default function () {
  const {withBaseUrl} = useBaseUrlUtils();
  const [fuse, setFuse] = useState(null);
  const [open, setOpen] = useState(false);
  const getData = React.useCallback(() => {
    return Promise.all([
      fetch(withBaseUrl('search_index.json')).then((res) => res.json()),
      fetch(withBaseUrl('search_result.json')).then((res) => res.json()),
    ]).then((res) => {
      setFuse(
        new Fuse(
          res[1],
          {
            threshold: 1,
            distance: 100,
            minMatchCharLength: 3,
            includeMatches: true,
            includeScore: true,
          },
          Fuse.parseIndex(res[0]),
        ),
      );
    });
  });
  return (
    <div>
      <div className="navbar__search">
        <input
          className="navbar__search-input"
          onClick={() => {
            if (fuse) {
              document.body.style.overflowY = 'hidden';
              setOpen(true);
            } else {
              getData().then(() => {
                document.body.style.overflowY = 'hidden';
                setOpen(true);
              });
            }
          }}
        />
      </div>
      <Modal
        isOpen={open}
        fuse={fuse}
        setOpen={() => {
          document.body.style.overflowY = 'visible';
          setOpen(false);
        }}
      />
    </div>
  );
}
