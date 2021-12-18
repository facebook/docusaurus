/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {useThemeConfig} from './utils/useThemeConfig';

export type {
  ThemeConfig,
  UserThemeConfig,
  Navbar,
  NavbarItem,
  NavbarLogo,
  Footer,
  FooterLinks,
  FooterLinkItem,
  ColorModeConfig,
} from './utils/useThemeConfig';

export {createStorageSlot, listStorageKeys} from './utils/storageUtils';

export {useAlternatePageUtils} from './utils/useAlternatePageUtils';

export {useContextualSearchFilters} from './utils/useContextualSearchFilters';

export {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
} from './utils/codeBlockUtils';

export {docVersionSearchTag, DEFAULT_SEARCH_TAG} from './utils/searchUtils';

export {
  isDocsPluginEnabled,
  DocsVersionProvider,
  useDocsVersion,
  useDocById,
  DocsSidebarProvider,
  useDocsSidebar,
  findSidebarCategory,
  findFirstCategoryLink,
  useCurrentSidebarCategory,
  isActiveSidebarItem,
} from './utils/docsUtils';

export {isSamePath} from './utils/pathUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {usePluralForm} from './utils/usePluralForm';

export {useLocationChange} from './utils/useLocationChange';

export {usePrevious} from './utils/usePrevious';

export {useCollapsible, Collapsible} from './components/Collapsible';
export type {
  UseCollapsibleConfig,
  UseCollapsibleReturns,
} from './components/Collapsible';

export {default as Details} from './components/Details';
export type {DetailsProps} from './components/Details';

export {
  MobileSecondaryMenuProvider,
  MobileSecondaryMenuFiller,
  useMobileSecondaryMenuRenderer,
} from './utils/mobileSecondaryMenu';
export type {MobileSecondaryMenuComponent} from './utils/mobileSecondaryMenu';

export {
  useDocsPreferredVersion,
  useDocsPreferredVersionByPluginId,
} from './utils/docsPreferredVersion/useDocsPreferredVersion';

export {duplicates, uniq} from './utils/jsUtils';

export {DocsPreferredVersionContextProvider} from './utils/docsPreferredVersion/DocsPreferredVersionProvider';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {
  AnnouncementBarProvider,
  useAnnouncementBar,
} from './utils/announcementBarUtils';

export {useLocalPathname} from './utils/useLocalPathname';

export {translateTagsPageTitle, listTagsByLetters} from './utils/tagsUtils';
export type {TagLetterEntry} from './utils/tagsUtils';

export {useHistoryPopHandler} from './utils/historyUtils';

export {default as useTOCHighlight} from './utils/useTOCHighlight';
export type {TOCHighlightConfig} from './utils/useTOCHighlight';

export {useTOCFilter} from './utils/tocUtils';

export {
  ScrollControllerProvider,
  useScrollController,
  useScrollPosition,
  useScrollPositionBlocker,
} from './utils/scrollUtils';

export {
  useIsomorphicLayoutEffect,
  useDynamicCallback,
} from './utils/reactUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';
