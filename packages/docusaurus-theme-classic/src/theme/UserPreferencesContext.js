/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createContext} from 'react';

const UserPreferencesContext = createContext({
  // Tab group choice.
  tabGroupChoices: {},
  setTabGroupChoices: () => {},

  // Announcement bar.
  isAnnouncementBarClosed: false,
  closeAnnouncementBar: () => {},
});

export default UserPreferencesContext;
