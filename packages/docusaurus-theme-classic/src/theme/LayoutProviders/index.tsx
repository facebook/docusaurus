/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ThemeProvider from '@theme/ThemeProvider';
import UserPreferencesProvider from '@theme/UserPreferencesProvider';
import ScrollMonitorProvider from '@theme/ScrollMonitorProvider';
import {
  AnnouncementBarProvider,
  DocsPreferredVersionContextProvider,
  MobileSecondaryMenuProvider,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/LayoutProviders';

export default function LayoutProviders({children}: Props): JSX.Element {
  return (
    <ThemeProvider>
      <AnnouncementBarProvider>
        <UserPreferencesProvider>
          <ScrollMonitorProvider>
            <DocsPreferredVersionContextProvider>
              <MobileSecondaryMenuProvider>
                {children}
              </MobileSecondaryMenuProvider>
            </DocsPreferredVersionContextProvider>
          </ScrollMonitorProvider>
        </UserPreferencesProvider>
      </AnnouncementBarProvider>
    </ThemeProvider>
  );
}
