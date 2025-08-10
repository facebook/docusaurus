/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {DEFAULT_SEARCH_TAG} from './utils/searchUtils';

// TODO Docusaurus v4: remove these workarounds as a breaking change
//  and remove docs plugin peerDeps in theme-common/package.json
//  This is public API surface that we need to keep for v3
//  See https://github.com/facebook/docusaurus/pull/10316
export function useCurrentSidebarCategory(...args: unknown[]): unknown {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@docusaurus/plugin-content-docs/client').useCurrentSidebarCategory(
    ...args,
  );
}
export function filterDocCardListItems(...args: unknown[]): unknown {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@docusaurus/plugin-content-docs/client').filterDocCardListItems(
    ...args,
  );
}
export function useDocsPreferredVersion(...args: unknown[]): unknown {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@docusaurus/plugin-content-docs/client').useDocsPreferredVersion(
    ...args,
  );
}
export function useContextualSearchFilters() {
  const {i18n} = useDocusaurusContext();
  const docsTags =
    // eslint-disable-next-line @typescript-eslint/no-var-requires, react-compiler/react-compiler
    require('@docusaurus/plugin-content-docs/client').useDocsContextualSearchTags();
  const tags = [DEFAULT_SEARCH_TAG, ...docsTags];
  return {locale: i18n.currentLocale, tags};
}

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
  type FooterColumnItem,
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

export {duplicates, uniq, groupBy} from './utils/jsUtils';

export {usePrismTheme} from './hooks/usePrismTheme';

export {processAdmonitionProps} from './utils/admonitionUtils';

export {
  useHistorySelector,
  useQueryString,
  useQueryStringList,
  useClearQueryString,
  mergeSearchParams,
  mergeSearchStrings,
} from './utils/historyUtils';

export {
  SkipToContentFallbackId,
  SkipToContentLink,
} from './utils/skipToContentUtils';

export {
  UnlistedBannerTitle,
  UnlistedBannerMessage,
  UnlistedMetadata,
  DraftBannerTitle,
  DraftBannerMessage,
} from './translations/contentVisibilityTranslations';

export {
  ErrorBoundaryTryAgainButton,
  ErrorBoundaryError,
  ErrorBoundaryErrorMessageFallback,
  ErrorCauseBoundary,
} from './utils/errorBoundaryUtils';
