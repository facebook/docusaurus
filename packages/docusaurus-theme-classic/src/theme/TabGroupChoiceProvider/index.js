/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useTabGroupChoice from '@theme/hooks/useTabGroupChoice';
import TabGroupChoiceContext from '@theme/TabGroupChoiceContext';

function TabGroupChoiceProvider(props) {
  const {getTabGroupChoice, setTabGroupChoice} = useTabGroupChoice();

  return (
    <TabGroupChoiceContext.Provider
      value={{getTabGroupChoice, setTabGroupChoice}}>
      {props.children}
    </TabGroupChoiceContext.Provider>
  );
}

export default TabGroupChoiceProvider;
