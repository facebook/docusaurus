/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import TabGroupChoiceContext from '@theme/TabGroupChoiceContext';

function useTabGroupChoiceContext() {
  return useContext(TabGroupChoiceContext);
}

export default useTabGroupChoiceContext;
