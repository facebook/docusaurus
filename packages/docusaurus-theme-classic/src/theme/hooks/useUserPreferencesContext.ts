/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import UserPreferencesContext from '@theme/UserPreferencesContext';

function useUserPreferencesContext(): {
  tabGroupChoices: {readonly [groupId: string]: string};
  setTabGroupChoices: (groupId: string, newChoice: string) => void;
  isAnnouncementBarClosed: boolean;
  closeAnnouncementBar: () => void;
} {
  return useContext(UserPreferencesContext);
}

export default useUserPreferencesContext;
