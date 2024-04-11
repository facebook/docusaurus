/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * APIs to document
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

export {default as ThemedComponent} from './components/ThemedComponent';

export {
  createStorageSlot,
  useStorageSlot,
  listStorageKeys,
} from './utils/storageUtils';

export {useContextualSearchFilters} from './utils/searchUtils';

export {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from './utils/docsUtils';

export {
  useBlogListPageStructuredData,
  useBlogPostStructuredData,
} from './utils/structuredDataUtils';

export {usePluralForm} from './utils/usePluralForm';

export {useCollapsible, Collapsible} from './components/Collapsible';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {prefersReducedMotion} from './utils/accessibilityUtils';

export {
  useEvent,
  usePrevious,
  composeProviders,
  ReactContextError,
} from './utils/reactUtils';

export {PageMetadata, HtmlClassNameProvider} from './utils/metadataUtils';

export {useColorMode, type ColorMode} from './contexts/colorMode';

export {
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
} from './contexts/navbarSecondaryMenu/content';

export {useWindowSize} from './hooks/useWindowSize';

/*
 * APIs kept undocumented, on purpose
 * Note: we still guarantee retro-compatibility on those
 */

export {
  translateTagsPageTitle,
  listTagsByLetters,
  type TagLetterEntry,
} from './utils/tagsUtils';

export {
  useSearchQueryString,
  useSearchLinkCreator,
} from './hooks/useSearchPage';

export {isMultiColumnFooterLinks} from './utils/footerUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';

export {duplicates, uniq} from './utils/jsUtils';

export {usePrismTheme} from './hooks/usePrismTheme';

export {useDocsPreferredVersion} from './contexts/docsPreferredVersion';

export {processAdmonitionProps} from './utils/admonitionUtils';

export {
  useHistorySelector,
  useQueryString,
  useQueryStringList,
  useClearQueryString,
} from './utils/historyUtils';

export {
  SkipToContentFallbackId,
  SkipToContentLink,
} from './utils/skipToContentUtils';

export {
  UnlistedBannerTitle,
  UnlistedBannerMessage,
  UnlistedMetadata,
} from './utils/unlistedUtils';

export {
  ErrorBoundaryTryAgainButton,
  ErrorBoundaryError,
  ErrorBoundaryErrorMessageFallback,
  ErrorCauseBoundary,
} from './utils/errorBoundaryUtils';
