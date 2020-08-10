/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';

let Modal: any = null;

export default function (): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="navbar__search">
        <input
          className="navbar__search-input"
          onClick={() => {
            document.body.style.overflowY = 'hidden';
            import('@theme/SearchModal').then(({default: modal}) => {
              Modal = modal;
              setOpen(true);
            });
          }}
        />
      </div>
      {open ? (
        <Modal
          isOpen={open}
          setOpen={() => {
            document.body.style.overflowY = 'visible';
            setOpen(false);
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}
