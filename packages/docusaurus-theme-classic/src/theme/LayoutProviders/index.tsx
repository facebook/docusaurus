/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  ColorModeProvider,
  TabGroupChoiceProvider,
  AnnouncementBarProvider,
  DocsPreferredVersionContextProvider,
  MobileSecondaryMenuProvider,
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
              <MobileSecondaryMenuProvider>
                {children}
              </MobileSecondaryMenuProvider>
            </DocsPreferredVersionContextProvider>
          </ScrollControllerProvider>
        </TabGroupChoiceProvider>
      </AnnouncementBarProvider>
    </ColorModeProvider>
  );
}
