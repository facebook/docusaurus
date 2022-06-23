/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
APIs to document
 */

export {useThemeConfig} from './utils/useThemeConfig';
export type {
  ThemeConfig,
  UserThemeConfig,
  Navbar,
  NavbarItem,
  NavbarLogo,
  MultiColumnFooter,
  SimpleFooter,
  Footer,
  FooterLogo,
  FooterLinkItem,
  ColorModeConfig,
} from './utils/useThemeConfig';

export {useColorMode, type ColorMode} from './contexts/colorMode';

export {usePrismTheme} from './hooks/usePrismTheme';

export {useCurrentSidebarCategory} from './utils/docsUtils';

export {usePluralForm} from './utils/usePluralForm';

export {PageMetadata, HtmlClassNameProvider} from './utils/metadataUtils';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {useContextualSearchFilters} from './utils/searchUtils';

export {useCollapsible, Collapsible} from './components/Collapsible';

/*
APIs kept undocumented, on purpose
Note: we still guarantee retro-compatibility on those
 */

export {useWindowSize} from './hooks/useWindowSize';

export {useBackToTopButton} from './hooks/useBackToTopButton';

export {
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
} from './contexts/navbarSecondaryMenu/content';

export {
  translateTagsPageTitle,
  listTagsByLetters,
  type TagLetterEntry,
} from './utils/tagsUtils';

export {isMultiColumnFooterLinks} from './utils/footerUtils';

export {isRegexpStringMatch} from './utils/regexpUtils';

export {createStorageSlot, listStorageKeys} from './utils/storageUtils';

export {
  useIsomorphicLayoutEffect,
  useDynamicCallback, // TODO rename to useEvent()
  usePrevious,
  ReactContextError,
} from './utils/reactUtils';

export {duplicates, uniq} from './utils/jsUtils';
