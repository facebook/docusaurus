/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This re-export permits to handle some level of retro-compatibility
// Users might swizzle unsafe components, using our internal apis.
// When we move an API from internal to public, former internal imports
// should keep working => less annoying for users.
// TODO: how do we detect legacy internal imports in our own code?
 
// export * from './index';

export {
  type Navbar,
  type NavbarItem,
  type NavbarLogo,
} from './utils/useThemeConfig';
export {
  DocSidebarItemsExpandedStateProvider,
  useDocSidebarItemsExpandedState,
} from './contexts/docSidebarItemsExpandedState';
export {DocsVersionProvider, useDocsVersion} from './contexts/docsVersion';
export {DocsSidebarProvider, useDocsSidebar} from './contexts/docsSidebar';
export {DocProvider, useDoc} from './contexts/doc';
export type {DocContextValue} from './contexts/doc';

export {createStorageSlot, listStorageKeys} from './utils/storageUtils';

export {useAlternatePageUtils} from './utils/useAlternatePageUtils';

export {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
} from './utils/codeBlockUtils';

export {docVersionSearchTag, DEFAULT_SEARCH_TAG} from './utils/searchUtils';

export {
  isDocsPluginEnabled,
  useDocById,
  findSidebarCategory,
  findFirstCategoryLink,
  isActiveSidebarItem,
  useSidebarBreadcrumbs,
  useDocsVersionCandidates,
  useLayoutDoc,
  useLayoutDocsSidebar,
  useDocRouteMetadata,
} from './utils/docsUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {useLocationChange} from './utils/useLocationChange';

export {useCollapsible, Collapsible} from './components/Collapsible';

export {
  useDocsPreferredVersion,
  useDocsPreferredVersionByPluginId,
  DocsPreferredVersionContextProvider,
} from './contexts/docsPreferredVersion';

export {duplicates, uniq} from './utils/jsUtils';

export {
  AnnouncementBarProvider,
  useAnnouncementBar,
} from './contexts/announcementBar';

export {useLocalPathname} from './utils/useLocalPathname';

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

export {
  ScrollControllerProvider,
  useScrollController,
  useScrollPosition,
  useScrollPositionBlocker,
  useSmoothScrollTo,
} from './utils/scrollUtils';

export {
  useIsomorphicLayoutEffect,
  useDynamicCallback,
  usePrevious,
  ReactContextError,
} from './utils/reactUtils';

export {useHomePageRoute, isSamePath} from './utils/routesUtils';

export {PluginHtmlClassNameProvider} from './utils/metadataUtils';

export {ColorModeProvider, type ColorMode} from './contexts/colorMode';

export {splitNavbarItems, NavbarProvider} from './utils/navbarUtils';

export {
  useTabGroupChoice,
  TabGroupChoiceProvider,
} from './contexts/tabGroupChoice';

export {useNavbarMobileSidebar} from './contexts/navbarMobileSidebar';
export {useNavbarSecondaryMenu} from './contexts/navbarSecondaryMenu/display';

export {useHideableNavbar} from './hooks/useHideableNavbar';
export {
  useKeyboardNavigation,
  keyboardFocusedClassName,
} from './hooks/useKeyboardNavigation';
export {useLockBodyScroll} from './hooks/useLockBodyScroll';
export {useSearchPage} from './hooks/useSearchPage';
export {useCodeWordWrap} from './hooks/useCodeWordWrap';
export {useSkipToContent} from './hooks/useSkipToContent';
