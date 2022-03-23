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
} from './contexts/docSidebarItemsExpandedState';
export {DocsVersionProvider, useDocsVersion} from './contexts/docsVersion';
export {DocsSidebarProvider, useDocsSidebar} from './contexts/docsSidebar';

export {createStorageSlot, listStorageKeys} from './utils/storageUtils';

export {useAlternatePageUtils} from './utils/useAlternatePageUtils';

export {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
} from './utils/codeBlockUtils';

export {
  docVersionSearchTag,
  DEFAULT_SEARCH_TAG,
  useContextualSearchFilters,
} from './utils/searchUtils';

export {
  isDocsPluginEnabled,
  useDocById,
  findSidebarCategory,
  findFirstCategoryLink,
  useCurrentSidebarCategory,
  isActiveSidebarItem,
  useSidebarBreadcrumbs,
} from './utils/docsUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {usePluralForm} from './utils/usePluralForm';

export {useLocationChange} from './utils/useLocationChange';

export {useCollapsible, Collapsible} from './components/Collapsible';

export {Details, type DetailsProps} from './components/Details';

export {
  useDocsPreferredVersion,
  useDocsPreferredVersionByPluginId,
  DocsPreferredVersionContextProvider,
} from './contexts/docsPreferredVersion';

export {duplicates, uniq} from './utils/jsUtils';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {
  AnnouncementBarProvider,
  useAnnouncementBar,
} from './contexts/announcementBar';

export {useLocalPathname} from './utils/useLocalPathname';

export {
  translateTagsPageTitle,
  listTagsByLetters,
  type TagLetterEntry,
  type TagsListItem,
} from './utils/tagsUtils';

export {useHistoryPopHandler} from './utils/historyUtils';

export {
  useTOCHighlight,
  type TOCHighlightConfig,
} from './hooks/useTOCHighlight';

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
  usePrevious,
  ReactContextError,
} from './utils/reactUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';

export {useHomePageRoute, isSamePath} from './utils/routesUtils';

export {
  PageMetadata,
  HtmlClassNameProvider,
  PluginHtmlClassNameProvider,
} from './utils/metadataUtils';

export {
  useColorMode,
  ColorModeProvider,
  type ColorMode,
} from './contexts/colorMode';

export {splitNavbarItems, NavbarProvider} from './utils/navbarUtils';

export {
  useTabGroupChoice,
  TabGroupChoiceProvider,
} from './contexts/tabGroupChoice';

export {useNavbarMobileSidebar} from './contexts/navbarMobileSidebar';
export {
  useNavbarSecondaryMenu,
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
} from './contexts/navbarSecondaryMenu';

export {useHideableNavbar} from './hooks/useHideableNavbar';
export {
  useKeyboardNavigation,
  keyboardFocusedClassName,
} from './hooks/useKeyboardNavigation';
export {usePrismTheme} from './hooks/usePrismTheme';
export {useLockBodyScroll} from './hooks/useLockBodyScroll';
export {useWindowSize} from './hooks/useWindowSize';
export {useSearchPage} from './hooks/useSearchPage';
