/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ThemeProvider from '@theme/ThemeProvider';
import UserPreferencesProvider from '@theme/UserPreferencesProvider';
import DocsPreferredVersionContextProvider from '../../utils/docsPreferredVersion/DocsPreferredVersionProvider';

export default function LayoutProviders({children}) {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <DocsPreferredVersionContextProvider>
          {children}
        </DocsPreferredVersionContextProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}
