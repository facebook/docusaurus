/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo} from 'react';

import useTabGroupChoice from '@theme/hooks/useTabGroupChoice';
import UserPreferencesContext from '@theme/UserPreferencesContext';
import type {Props} from '@theme/UserPreferencesProvider';

function UserPreferencesProvider(props: Props): JSX.Element {
  const {tabGroupChoices, setTabGroupChoices} = useTabGroupChoice();
  const contextValue = useMemo(
    () => ({
      tabGroupChoices,
      setTabGroupChoices,
    }),
    [tabGroupChoices, setTabGroupChoices],
  );
  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {props.children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesProvider;
