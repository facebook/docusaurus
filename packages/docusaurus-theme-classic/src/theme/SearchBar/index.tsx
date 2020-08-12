/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import Modal from '@theme/SearchModal';
import {useSearch} from '@theme/useSearch';

export default function (): JSX.Element {
  const [open, setOpen] = useState(false);
  const {search, loading, ref} = useSearch();
  return (
    <>
      <div className="navbar__search" ref={ref}>
        <input
          className="navbar__search-input"
          onClick={() => {
            document.body.style.overflowY = 'hidden';
            setOpen(true);
          }}
        />
      </div>
      {open && !loading && (
        <Modal
          search={search}
          isOpen={open}
          setOpen={() => {
            document.body.style.overflowY = 'visible';
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
