/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {composeProviders} from '../../utils/reactUtils';
import {ColorModeProvider} from '../../contexts/colorMode';
import {AnnouncementBarProvider} from '../../contexts/announcementBar';
import {TabGroupChoiceProvider} from '../../contexts/tabGroupChoice';
import {ScrollControllerProvider} from '../../utils/scrollUtils';
import {DocsPreferredVersionContextProvider} from '../../contexts/docsPreferredVersion';
import {PluginHtmlClassNameProvider} from '../../utils/metadataUtils';
import {NavbarProvider} from '../../utils/navbarUtils';

/**
 * A provider component that should be used at the top of the React tree
 * It is necessary for many theme-common features to work
 */
export const ThemeCommonProvider = composeProviders([
  ColorModeProvider,
  AnnouncementBarProvider,
  TabGroupChoiceProvider,
  ScrollControllerProvider,
  DocsPreferredVersionContextProvider,
  PluginHtmlClassNameProvider,
  NavbarProvider,
]);
