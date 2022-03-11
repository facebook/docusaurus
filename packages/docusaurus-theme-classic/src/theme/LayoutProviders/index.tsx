/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  NavbarMobileSidebarProvider,
  ColorModeProvider,
  TabGroupChoiceProvider,
  AnnouncementBarProvider,
  DocsPreferredVersionContextProvider,
  NavbarSecondaryMenuProvider,
  ScrollControllerProvider,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/LayoutProviders';

export default function LayoutProviders({children}: Props): JSX.Element {
  return (
    <ColorModeProvider>
      <AnnouncementBarProvider>
        <TabGroupChoiceProvider>
          <ScrollControllerProvider>
            <DocsPreferredVersionContextProvider>
              <NavbarSecondaryMenuProvider>
                <NavbarMobileSidebarProvider>
                  {children}
                </NavbarMobileSidebarProvider>
              </NavbarSecondaryMenuProvider>
            </DocsPreferredVersionContextProvider>
          </ScrollControllerProvider>
        </TabGroupChoiceProvider>
      </AnnouncementBarProvider>
    </ColorModeProvider>
  );
}
