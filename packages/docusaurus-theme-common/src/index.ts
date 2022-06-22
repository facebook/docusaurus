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
  MultiColumnFooter,
  SimpleFooter,
  Footer,
  FooterLogo,
  FooterLinkItem,
  ColorModeConfig,
} from './utils/useThemeConfig';

export {useColorMode, type ColorMode} from './contexts/colorMode';

export {usePrismTheme} from './hooks/usePrismTheme';
export {getPrismCssVariables} from './utils/codeBlockUtils';

export {useCurrentSidebarCategory} from './utils/docsUtils';

export {usePluralForm} from './utils/usePluralForm';

export {PageMetadata, HtmlClassNameProvider} from './utils/metadataUtils';

export {ThemeClassNames} from './utils/ThemeClassNames';

export {useContextualSearchFilters} from './utils/searchUtils';

// TODO Should these APIs bellow be public?

export {useBackToTopButton} from './hooks/useBackToTopButton';
export {useWindowSize} from './hooks/useWindowSize';

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
