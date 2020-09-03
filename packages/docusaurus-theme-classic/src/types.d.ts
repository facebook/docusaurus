/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable spaced-comment */
/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/plugin-content-blog" />
/// <reference types="@docusaurus/plugin-content-docs" />
/// <reference types="@docusaurus/plugin-content-pages" />

declare module '@theme/AnnouncementBar' {
  const AnnouncementBar: () => JSX.Element | null;
  export default AnnouncementBar;
}

declare module '@theme/BlogListPaginator' {
  import type {Metadata} from '@theme/BlogListPage';

  export type Props = {readonly metadata: Metadata};

  const BlogListPaginator: (props: Props) => JSX.Element;
  export default BlogListPaginator;
}

declare module '@theme/BlogPostItem' {
  import type {FrontMatter, Metadata} from '@theme/BlogPostPage';

  export type Props = {
    readonly frontMatter: FrontMatter;
    readonly metadata: Metadata;
    readonly truncated?: string | boolean;
    readonly isBlogPostPage?: boolean;
    readonly children: JSX.Element;
  };

  const BlogPostItem: (props: Props) => JSX.Element;
  export default BlogPostItem;
}

declare module '@theme/BlogPostPaginator' {
  type Item = {readonly title: string; readonly permalink: string};

  export type Props = {readonly nextItem?: Item; readonly prevItem?: Item};

  const BlogPostPaginator: (props: Props) => JSX.Element;
  export default BlogPostPaginator;
}

declare module '@theme/CodeBlock' {
  export type Props = {
    readonly children: string;
    readonly className?: string;
    readonly metastring?: string;
  };

  const CodeBlock: (props: Props) => JSX.Element;
  export default CodeBlock;
}

declare module '@theme/DocPaginator' {
  type PageInfo = {readonly permalink: string; readonly title: string};

  export type Props = {
    readonly metadata: {readonly previous?: PageInfo; readonly next?: PageInfo};
  };

  const DocPaginator: (props: Props) => JSX.Element;
  export default DocPaginator;
}

declare module '@theme/DocSidebar' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';

  export type Props = {
    readonly path: string;
    readonly sidebar: readonly PropSidebarItem[];
    readonly sidebarCollapsible?: boolean;
  };

  const DocSidebar: (props: Props) => JSX.Element;
  export default DocSidebar;
}

declare module '@theme/DocVersionSuggestions' {
  const DocVersionSuggestions: () => JSX.Element;
  export default DocVersionSuggestions;
}

declare module '@theme/Footer' {
  const Footer: () => JSX.Element | null;
  export default Footer;
}

declare module '@theme/Heading' {
  import type {ComponentProps} from 'react';

  export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  export type Props = ComponentProps<HeadingType>;

  const Heading: (Tag: HeadingType) => (props: Props) => JSX.Element;
  export default Heading;
}

declare module '@theme/hooks/useAnnoucementBar' {
  export type useAnnouncementBarReturns = {
    readonly isAnnouncementBarClosed: boolean;
    readonly closeAnnouncementBar: () => void;
  };

  const useAnnouncementBar: () => useAnnouncementBarReturns;
  export default useAnnouncementBar;
}

declare module '@theme/hooks/useHideableNavbar' {
  export type useHideableNavbarReturns = {
    readonly navbarRef: (node: HTMLElement | null) => void;
    readonly isNavbarVisible: boolean;
  };

  const useHideableNavbar: (hideOnScroll: boolean) => useHideableNavbarReturns;
  export default useHideableNavbar;
}

declare module '@theme/hooks/useLocationHash' {
  import type {Dispatch, SetStateAction} from 'react';

  export type useLocationHashReturns = readonly [
    string,
    Dispatch<SetStateAction<string>>,
  ];

  const useLocationHash: (initialHash: string) => useLocationHashReturns;
  export default useLocationHash;
}

declare module '@theme/hooks/useLockBodyScroll' {
  const useLockBodyScroll: (lock?: boolean) => void;
  export default useLockBodyScroll;
}

declare module '@theme/hooks/useLogo' {
  export type LogoLinkProps = {target?: string; rel?: string};

  export type useLogoReturns = {
    readonly logoLink: string;
    readonly logoLinkProps: LogoLinkProps;
    readonly logoImageUrl: string;
    readonly logoAlt: string;
  };

  const useLogo: () => useLogoReturns;
  export default useLogo;
}

declare module '@theme/hooks/usePrismTheme' {
  import defaultTheme from 'prism-react-renderer/themes/palenight';

  const usePrismTheme: () => typeof defaultTheme;
  export default usePrismTheme;
}

declare module '@theme/hooks/useScrollPosition' {
  export type ScrollPosition = {scrollX: number; scrollY: number};

  const useScrollPosition: (
    effect?: (position: ScrollPosition) => void,
    deps?: unknown[],
  ) => ScrollPosition;
  export default useScrollPosition;
}

declare module '@theme/hooks/useTabGroupChoice' {
  export type useTabGroupChoiceReturns = {
    readonly tabGroupChoices: {readonly [groupId: string]: string};
    readonly setTabGroupChoices: (groupId: string, newChoice: string) => void;
  };

  const useTabGroupChoice: () => useTabGroupChoiceReturns;
  export default useTabGroupChoice;
}

declare module '@theme/hooks/useTheme' {
  export type useThemeReturns = {
    readonly isDarkTheme: boolean;
    readonly setLightTheme: () => void;
    readonly setDarkTheme: () => void;
  };

  const useTheme: () => useThemeReturns;
  export default useTheme;
}

declare module '@theme/hooks/useThemeContext' {
  export type ThemeContextProps = {
    isDarkTheme: boolean;
    setLightTheme: () => void;
    setDarkTheme: () => void;
  };

  export default function useThemeContext(): ThemeContextProps;
}

declare module '@theme/hooks/useTOCHighlight' {
  export default function useTOCHighlight(
    linkClassName: string,
    linkActiveClassName: string,
    topOffset: number,
  ): void;
}

declare module '@theme/hooks/useUserPreferencesContext' {
  export type UserPreferencesContextProps = {
    tabGroupChoices: {readonly [groupId: string]: string};
    setTabGroupChoices: (groupId: string, newChoice: string) => void;
    isAnnouncementBarClosed: boolean;
    closeAnnouncementBar: () => void;
  };

  export default function useUserPreferencesContext(): UserPreferencesContextProps;
}

declare module '@theme/hooks/useWindowSize' {
  export const windowSizes: {
    desktop: 'desktop';
    mobile: 'mobile';
  };

  export type WindowSize = keyof typeof windowSizes;

  export default function useWindowSize(): WindowSize | undefined;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export type Props = {
    children: ReactNode;
    title?: string;
    noFooter?: boolean;
    description?: string;
    image?: string;
    keywords?: string[];
    permalink?: string;
  };

  const Layout: (props: Props) => JSX.Element;
  export default Layout;
}

declare module '@theme/MDXComponents' {
  import {ComponentProps} from 'react';
  import CodeBlock from '@theme/CodeBlock';

  export type MDXComponentsObject = {
    readonly code: typeof CodeBlock;
    readonly a: (props: ComponentProps<'a'>) => JSX.Element;
    readonly pre: (props: ComponentProps<'div'>) => JSX.Element;
    readonly h1: (props: ComponentProps<'h1'>) => JSX.Element;
    readonly h2: (props: ComponentProps<'h2'>) => JSX.Element;
    readonly h3: (props: ComponentProps<'h3'>) => JSX.Element;
    readonly h4: (props: ComponentProps<'h4'>) => JSX.Element;
    readonly h5: (props: ComponentProps<'h5'>) => JSX.Element;
    readonly h6: (props: ComponentProps<'h6'>) => JSX.Element;
  };

  const MDXComponents: MDXComponentsObject;
  export default MDXComponents;
}

declare module '@theme/Navbar' {
  const Navbar: () => JSX.Element;
  export default Navbar;
}

declare module '@theme/NavbarItem/DefaultNavbarItem' {
  import type {ComponentProps} from 'react';

  export type NavLinkProps = {
    activeBasePath?: string;
    activeBaseRegex?: string;
    to?: string;
    href?: string;
    label?: string;
    activeClassName?: string;
    prependBaseUrlToHref?: string;
  } & ComponentProps<'a'>;

  export type DesktopOrMobileNavBarItemProps = NavLinkProps & {
    readonly items?: readonly NavLinkProps[];
    readonly position?: 'left' | 'right';
    readonly className?: string;
  };

  export type Props = DesktopOrMobileNavBarItemProps & {
    readonly mobile?: boolean;
  };

  const DefaultNavbarItem: (props: Props) => JSX.Element;
  export default DefaultNavbarItem;
}

declare module '@theme/NavbarItem/DocsVersionDropdownNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';

  export type Props = DefaultNavbarItemProps & {readonly docsPluginId?: string};

  const DocsVersionDropdownNavbarItem: (props: Props) => JSX.Element;
  export default DocsVersionDropdownNavbarItem;
}

declare module '@theme/NavbarItem/DocsVersionNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';

  export type Props = DefaultNavbarItemProps & {readonly docsPluginId?: string};

  const DocsVersionNavbarItem: (props: Props) => JSX.Element;
  export default DocsVersionNavbarItem;
}

declare module '@theme/NavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  import type {Props as DocsVersionDropdownNavbarItemProps} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
  import type {Props as DocsVersionNavbarItemProps} from '@theme/NavbarItem/DocsVersionNavbarItem';

  export type Props =
    | ({readonly type: 'default'} & DefaultNavbarItemProps)
    | ({
        readonly type: 'docsVersionDropdown';
      } & DocsVersionDropdownNavbarItemProps)
    | ({readonly type: 'docsVersion'} & DocsVersionNavbarItemProps);

  const NavbarItem: (props: Props) => JSX.Element;
  export default NavbarItem;
}

declare module '@theme/TabItem' {
  import type {ReactNode} from 'react';

  export type Props = {readonly children: ReactNode};

  const TabItem: () => JSX.Element;
  export default TabItem;
}

declare module '@theme/Tabs' {
  import type {ReactElement} from 'react';

  export type Props = {
    readonly block?: boolean;
    readonly children: readonly ReactElement<{value: string}>[];
    readonly defaultValue?: string;
    readonly values: readonly {value: string; label: string}[];
    readonly groupId?: string;
  };

  const Tabs: () => JSX.Element;
  export default Tabs;
}

declare module '@theme/ThemeProvider' {
  import type {ReactNode} from 'react';

  export type Props = {readonly children: ReactNode};

  const ThemeProvider: (props: Props) => JSX.Element;
  export default ThemeProvider;
}

declare module '@theme/TOC' {
  import type {MarkdownRightTableOfContents} from '@docusaurus/types';

  export type TOCProps = {
    readonly headings: readonly MarkdownRightTableOfContents[];
  };

  const TOC: (props: TOCProps) => JSX.Element;
  export default TOC;
}

declare module '@theme/Toggle' {
  import {ComponentProps} from 'react';
  import ReactToggle from 'react-toggle';

  const Toggle: (props: ComponentProps<typeof ReactToggle>) => JSX.Element;
  export default Toggle;
}

declare module '@theme/UserPreferencesProvider' {
  import type {ReactNode} from 'react';

  export type Props = {readonly children: ReactNode};

  const UserPreferencesProvider: (props: Props) => JSX.Element;
  export default UserPreferencesProvider;
}

declare module '@theme/ThemeContext' {
  import type {Context} from 'react';
  import type {ThemeContextProps} from '@theme/hooks/useThemeContext';

  const ThemeContext: Context<ThemeContextProps | undefined>;
  export default ThemeContext;
}

declare module '@theme/UserPreferencesContext' {
  import type {Context} from 'react';
  import type {UserPreferencesContextProps} from '@theme/hooks/useUserPreferencesContext';

  const UserPreferencesContext: Context<
    UserPreferencesContextProps | undefined
  >;
  export default UserPreferencesContext;
}
