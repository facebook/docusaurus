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

export {useColorMode, type ColorMode} from './contexts/colorMode';

export {usePrismTheme} from './hooks/usePrismTheme';

export {useWindowSize} from './hooks/useWindowSize';

export {useCurrentSidebarCategory} from './utils/docsUtils';

export {usePluralForm} from './utils/usePluralForm';

export {PageMetadata, HtmlClassNameProvider} from './utils/metadataUtils';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {
  useIsomorphicLayoutEffect,
  useDynamicCallback, // TODO rename to useEvent()
  usePrevious,
  ReactContextError,
} from './utils/reactUtils';

export {useContextualSearchFilters} from './utils/searchUtils';

export {createStorageSlot, listStorageKeys} from './utils/storageUtils';

export {useCollapsible, Collapsible} from './components/Collapsible';

export {
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
} from './contexts/navbarSecondaryMenu/content';

/*
 * APIs kept undocumented, on purpose
 * Note: we still guarantee retro-compatibility on those
 */

export {useBackToTopButton} from './hooks/useBackToTopButton';

export {
  translateTagsPageTitle,
  listTagsByLetters,
  type TagLetterEntry,
} from './utils/tagsUtils';

export {isMultiColumnFooterLinks} from './utils/footerUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';

export {duplicates, uniq} from './utils/jsUtils';
