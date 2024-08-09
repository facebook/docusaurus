/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This re-export permits to handle some level of retro-compatibility. Users
// might swizzle unsafe components and expose these internal imports. When we
// move an API from internal to public, former internal imports should keep
// working, so that the change doesn't become breaking.
//
// Important: this line is removed from build output with the
// "removeThemeInternalReexport" script for CI checks. This ensures that none of
// our internal code relies on this re-export and that we don't forget to
// migrate theme internal imports to public imports.
//
// eslint-disable-next-line no-restricted-syntax
export * from './index';

export {
  AnnouncementBarProvider,
  useAnnouncementBar,
} from './contexts/announcementBar';

export {useTabs, sanitizeTabsChildren} from './utils/tabsUtils';
export type {TabValue, TabsProps, TabItemProps} from './utils/tabsUtils';

export {useNavbarMobileSidebar} from './contexts/navbarMobileSidebar';
export {useNavbarSecondaryMenu} from './contexts/navbarSecondaryMenu/display';

export {ColorModeProvider} from './contexts/colorMode';

export {useAlternatePageUtils} from './utils/useAlternatePageUtils';

export {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
} from './utils/codeBlockUtils';

export {DEFAULT_SEARCH_TAG} from './utils/searchUtils';

export {useTitleFormatter} from './utils/generalUtils';

export {useLocationChange} from './utils/useLocationChange';

export {useLocalPathname} from './utils/useLocalPathname';

export {
  useHistoryPopHandler,
  useHistorySelector,
  useQueryStringValue,
} from './utils/historyUtils';

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

export {useHomePageRoute, isSamePath} from './utils/routesUtils';

export {PluginHtmlClassNameProvider} from './utils/metadataUtils';

export {splitNavbarItems, NavbarProvider} from './utils/navbarUtils';

export {
  useTOCHighlight,
  type TOCHighlightConfig,
} from './hooks/useTOCHighlight';

export {useDateTimeFormat} from './utils/IntlUtils';

export {useHideableNavbar} from './hooks/useHideableNavbar';
export {
  useKeyboardNavigation,
  keyboardFocusedClassName,
} from './hooks/useKeyboardNavigation';
export {useLockBodyScroll} from './hooks/useLockBodyScroll';
export {useCodeWordWrap} from './hooks/useCodeWordWrap';
export {getPrismCssVariables} from './utils/codeBlockUtils';
export {useBackToTopButton} from './hooks/useBackToTopButton';

export {
  useBlogTagsPostsPageTitle,
  useBlogAuthorPageTitle,
  translateBlogAuthorsListPageTitle,
  BlogAuthorsListViewAllLabel,
} from './translations/blogTranslations';
