/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useHistory} from '@docusaurus/router';
import {prepareUserState} from '../../_utils';

export default function ClearAllButton() {
  const history = useHistory();
  const clearAll = () => {
    history.push({
      ...history.location,
      search: '',
      state: prepareUserState(),
    });
  };

  // TODO translate
  return (
    <button
      className="button button--outline button--primary"
      type="button"
      onClick={() => clearAll()}>
      Clear All
    </button>
  );
}
