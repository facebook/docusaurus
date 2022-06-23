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
//
// Important: this line is removed from build output for CI checks only
// See node script "removeThemeInternalReexport"
// This ensures that none of our internal code relies on this re-export
// and that we don't forget to migrate theme internal imports to public imports
//
// eslint-disable-next-line no-restricted-syntax
export * from './index';

export {
  DocSidebarItemsExpandedStateProvider,
  useDocSidebarItemsExpandedState,
} from './contexts/docSidebarItemsExpandedState';
export {DocsVersionProvider, useDocsVersion} from './contexts/docsVersion';
export {DocsSidebarProvider, useDocsSidebar} from './contexts/docsSidebar';
export {DocProvider, useDoc} from './contexts/doc';
export type {DocContextValue} from './contexts/doc';

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

export {
  useDocsPreferredVersion,
  useDocsPreferredVersionByPluginId,
  DocsPreferredVersionContextProvider,
} from './contexts/docsPreferredVersion';

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

export {ReactContextError} from './utils/reactUtils';

export {useHomePageRoute, isSamePath} from './utils/routesUtils';

export {PluginHtmlClassNameProvider} from './utils/metadataUtils';

export {ColorModeProvider} from './contexts/colorMode';

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
export {getPrismCssVariables} from './utils/codeBlockUtils';
