/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useTabGroupChoice from '@theme/hooks/useTabGroupChoice';
import useAnnouncementBar from '@theme/hooks/useAnnouncementBar';
import UserPreferencesContext from '@theme/UserPreferencesContext';
import type {Props} from '@theme/UserPreferencesProvider';

function UserPreferencesProvider(props: Props): JSX.Element {
  const {tabGroupChoices, setTabGroupChoices} = useTabGroupChoice();
  const {isAnnouncementBarClosed, closeAnnouncementBar} = useAnnouncementBar();

  return (
    <UserPreferencesContext.Provider
      value={{
        tabGroupChoices,
        setTabGroupChoices,
        isAnnouncementBarClosed,
        closeAnnouncementBar,
      }}>
      {props.children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesProvider;
