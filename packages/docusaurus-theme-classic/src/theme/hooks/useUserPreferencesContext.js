/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import UserPreferencesContext from '@theme/UserPreferencesContext';

function useUserPreferencesContext() {
  const context = useContext(UserPreferencesContext);
  if (context == null) {
    throw new Error(
      '`useUserPreferencesContext` is used outside of `Layout` Component.',
    );
  }
  return context;
}

export default useUserPreferencesContext;
