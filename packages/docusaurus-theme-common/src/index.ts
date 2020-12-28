/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  useThemeConfig,
  ThemeConfig,
  Navbar,
  NavbarItem,
  NavbarLogo,
  Footer,
  FooterLinks,
  FooterLinkItem,
} from './utils/useThemeConfig';

export {docVersionSearchTag, DEFAULT_SEARCH_TAG} from './utils/searchUtils';

export {isDocsPluginEnabled} from './utils/docsUtils';

export {isSamePath} from './utils/pathUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {
  useDocsPreferredVersion,
  useDocsPreferredVersionByPluginId,
} from './utils/docsPreferredVersion/useDocsPreferredVersion';

export {DocsPreferredVersionContextProvider} from './utils/docsPreferredVersion/DocsPreferredVersionProvider';
