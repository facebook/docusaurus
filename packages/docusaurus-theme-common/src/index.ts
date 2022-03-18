/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  useThemeConfig,
  type ThemeConfig,
  type UserThemeConfig,
  type Navbar,
  type NavbarItem,
  type NavbarLogo,
  type MultiColumnFooter,
  type SimpleFooter,
  type Footer,
  type FooterLogo,
  type FooterLinkItem,
  type ColorModeConfig,
} from './utils/useThemeConfig';
export {
  DocSidebarItemsExpandedStateProvider,
  useDocSidebarItemsExpandedState,
} from './utils/docSidebarItemsExpandedState';

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
  useSidebarBreadcrumbs,
} from './utils/docsUtils';

export {isSamePath} from './utils/pathUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {usePluralForm} from './utils/usePluralForm';

export {useLocationChange} from './utils/useLocationChange';

export {usePrevious} from './utils/usePrevious';

export {
  useCollapsible,
  Collapsible,
  type UseCollapsibleConfig,
  type UseCollapsibleReturns,
} from './components/Collapsible';

export {default as Details, type DetailsProps} from './components/Details';

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

export {
  translateTagsPageTitle,
  listTagsByLetters,
  type TagLetterEntry,
  type TagsListItem,
} from './utils/tagsUtils';

export {useHistoryPopHandler} from './utils/historyUtils';

export {
  default as useTOCHighlight,
  type TOCHighlightConfig,
} from './utils/useTOCHighlight';

export {
  useFilteredAndTreeifiedTOC,
  useTreeifiedTOC,
  type TOCTreeNode,
} from './utils/tocUtils';

export {isMultiColumnFooterLinks} from './utils/footerUtils';

export {
  ScrollControllerProvider,
  useScrollController,
  useScrollPosition,
  useScrollPositionBlocker,
} from './utils/scrollUtils';

export {
  useIsomorphicLayoutEffect,
  useDynamicCallback,
  ReactContextError,
} from './utils/reactUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';

export {useHomePageRoute} from './utils/routesUtils';

export {
  HtmlClassNameProvider,
  PluginHtmlClassNameProvider,
} from './utils/metadataUtilsTemp';

export {
  useColorMode,
  ColorModeProvider,
  type ColorMode,
} from './utils/colorModeUtils';

export {
  useTabGroupChoice,
  TabGroupChoiceProvider,
} from './utils/tabGroupChoiceUtils';

export {default as useHideableNavbar} from './hooks/useHideableNavbar';
export {
  default as useKeyboardNavigation,
  keyboardFocusedClassName,
} from './hooks/useKeyboardNavigation';
export {default as usePrismTheme} from './hooks/usePrismTheme';
export {default as useLockBodyScroll} from './hooks/useLockBodyScroll';
export {default as useWindowSize} from './hooks/useWindowSize';
export {default as useSearchPage} from './hooks/useSearchPage';
