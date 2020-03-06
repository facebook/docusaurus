/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createContext} from 'react';

const TabGroupChoiceContext = createContext({
  getTabGroupChoice: () => undefined,
  setTabGroupChoice: () => {},
});

export default TabGroupChoiceContext;
