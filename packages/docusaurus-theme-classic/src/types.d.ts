/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/plugin-content-blog" />
/// <reference types="@docusaurus/plugin-content-docs" />
/// <reference types="@docusaurus/plugin-content-pages" />

declare module '@theme/NotFound' {
  import type {Props} from '@theme/DocPage';
  function NotFound(_props: Props): JSX.Element;
  export default NotFound;
}

declare module '@theme/ThemeContext' {
  import React from 'react';
  import type {ThemeContextProps} from '@theme/hooks/useThemeContext';
  const ThemeContext: React.Context<ThemeContextProps | undefined>;
  export default ThemeContext;
}

declare module '@theme/UserPreferencesContext' {
  import type {UserPreferencesContextProps} from '@theme/hooks/useUserPreferencesContext';
  const UserPreferencesContext: import('react').Context<
    UserPreferencesContextProps | undefined
  >;
  export default UserPreferencesContext;
}

declare module '@theme/prism-include-languages' {
  import type * as PrismNamespace from 'prismjs';
  const prismIncludeLanguages: (PrismObject: typeof PrismNamespace) => void;
  export default prismIncludeLanguages;
}

declare module '@theme/AnnouncementBar' {
  function AnnouncementBar(): JSX.Element | null;
  export default AnnouncementBar;
}

declare module '@theme/BlogListPaginator' {
  import type {Metadata} from '@theme/BlogListPage';
  export type Props = {
    readonly metadata: Metadata;
  };
  function BlogListPaginator(props: Props): JSX.Element;
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
  function BlogPostItem(props: Props): JSX.Element;
  export default BlogPostItem;
}

declare module '@theme/BlogPostPaginator' {
  type Item = {
    readonly title: string;
    readonly permalink: string;
  };
  export type Props = {
    readonly nextItem?: Item;
    readonly prevItem?: Item;
  };
  function BlogPostPaginator(props: Props): JSX.Element;
  export default BlogPostPaginator;
}

declare module '@theme/CodeBlock' {
  export type Props = {
    readonly children: string;
    readonly className?: string;
    readonly metastring?: string;
  };
  export default function CodeBlock({
    children,
    className: languageClassName,
    metastring,
  }: Props): JSX.Element;
}

declare module '@theme/DocPaginator' {
  type PageInfo = {
    readonly permalink: string;
    readonly title: string;
  };
  export type Props = {
    readonly metadata: {
      readonly previous?: PageInfo;
      readonly next?: PageInfo;
    };
  };
  function DocPaginator(props: Props): JSX.Element;
  export default DocPaginator;
}

declare module '@theme/DocSidebar' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';
  export type Props = {
    readonly path: string;
    readonly sidebar: readonly PropSidebarItem[];
    readonly sidebarCollapsible?: boolean;
    readonly onCollapse: () => void;
    readonly isHidden: boolean;
  };
  function DocSidebar({
    path,
    sidebar,
    sidebarCollapsible,
    onCollapse,
    isHidden,
  }: Props): JSX.Element | null;
  export default DocSidebar;
}

declare module '@theme/DocVersionSuggestions' {
  function DocVersionSuggestions(): JSX.Element;
  export default DocVersionSuggestions;
}

declare module '@theme/EditThisPage' {
  export type Props = {
    readonly editUrl: string;
  };
  export default function EditThisPage({editUrl}: Props): JSX.Element;
}

declare module '@theme/Footer' {
  function Footer(): JSX.Element | null;
  export default Footer;
}

declare module '@theme/Heading' {
  import type {ComponentProps} from 'react';
  export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  export type Props = ComponentProps<HeadingType>;
  const Heading: (Tag: HeadingType) => (props: Props) => JSX.Element;
  export default Heading;
}

declare module '@theme/IconArrow' {
  import React, {ComponentProps} from 'react';
  export type Props = ComponentProps<'svg'>;
  const IconArrow: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  export default IconArrow;
}

declare module '@theme/IconEdit' {
  import React, {ComponentProps} from 'react';
  export type Props = ComponentProps<'svg'>;
  const IconEdit: ({
    className,
    ...restProps
  }: React.SVGProps<SVGSVGElement>) => JSX.Element;
  export default IconEdit;
}

declare module '@theme/IconLanguage' {
  import React, {ComponentProps} from 'react';
  export type Props = ComponentProps<'svg'>;
  const IconLanguage: ({
    width,
    height,
    ...props
  }: React.SVGProps<SVGSVGElement>) => JSX.Element;
  export default IconLanguage;
}

declare module '@theme/IconMenu' {
  import React, {ComponentProps} from 'react';
  export type Props = ComponentProps<'svg'>;
  const IconMenu: ({
    width,
    height,
    className,
    ...restProps
  }: React.SVGProps<SVGSVGElement>) => JSX.Element;
  export default IconMenu;
}

declare module '@theme/LastUpdated' {
  export type Props = {
    lastUpdatedAt?: number;
    formattedLastUpdatedAt?: string;
    lastUpdatedBy?: string;
  };
  export default function LastUpdated({
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
  }: Props): JSX.Element;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';
  export type Props = {
    children: ReactNode;
    title?: string;
    noFooter?: boolean;
    description?: string;
    image?: string;
    keywords?: string | string[];
    permalink?: string;
    wrapperClassName?: string;
    searchMetadatas?: {
      version?: string;
      tag?: string;
    };
  };
  function Layout(props: Props): JSX.Element;
  export default Layout;
}

declare module '@theme/LayoutHead' {
  import type {Props} from '@theme/Layout';
  export default function LayoutHead(props: Props): JSX.Element;
}

declare module '@theme/LayoutProviders' {
  import type {ReactNode} from 'react';
  export type Props = {
    readonly children: ReactNode;
  };
  export default function LayoutProviders({children}: Props): JSX.Element;
}

declare module '@theme/Logo' {
  import type {ComponentProps} from 'react';
  export type Props = {
    imageClassName?: string;
    titleClassName?: string;
  } & ComponentProps<'a'>;
  const Logo: (props: Props) => JSX.Element;
  export default Logo;
}

declare module '@theme/MDXComponents' {
  import type {ComponentProps} from 'react';
  import CodeBlock from '@theme/CodeBlock';
  export type MDXComponentsObject = {
    readonly code: typeof CodeBlock;
    readonly a: (props: ComponentProps<'a'>) => JSX.Element;
    readonly pre: typeof CodeBlock;
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
  function Navbar(): JSX.Element;
  export default Navbar;
}

declare module '@theme/NavbarItem/DefaultNavbarItem' {
  import type {ReactNode, ComponentProps} from 'react';
  export type NavLinkProps = {
    activeBasePath?: string;
    activeBaseRegex?: string;
    to?: string;
    exact?: boolean;
    href?: string;
    label?: ReactNode;
    activeClassName?: string;
    prependBaseUrlToHref?: string;
    isActive?: () => boolean;
  } & ComponentProps<'a'>;
  export type DesktopOrMobileNavBarItemProps = NavLinkProps & {
    readonly items?: readonly NavLinkProps[];
    readonly position?: 'left' | 'right';
    readonly className?: string;
  };
  export type Props = DesktopOrMobileNavBarItemProps & {
    readonly mobile?: boolean;
  };
  function DefaultNavbarItem({mobile, ...props}: Props): JSX.Element;
  export default DefaultNavbarItem;
}

declare module '@theme/NavbarItem/DocNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  export type Props = DefaultNavbarItemProps & {
    readonly docId: string;
    readonly activeSidebarClassName: string;
    readonly docsPluginId?: string;
  };
  export default function DocNavbarItem({
    docId,
    activeSidebarClassName,
    label: staticLabel,
    docsPluginId,
    ...props
  }: Props): JSX.Element;
}

declare module '@theme/NavbarItem/DocsVersionDropdownNavbarItem' {
  import type {
    NavLinkProps,
    Props as DefaultNavbarItemProps,
  } from '@theme/NavbarItem/DefaultNavbarItem';
  export type Props = DefaultNavbarItemProps & {
    readonly docsPluginId?: string;
    readonly dropdownActiveClassDisabled?: boolean;
    readonly dropdownItemsBefore: NavLinkProps[];
    readonly dropdownItemsAfter: NavLinkProps[];
  };
  export default function DocsVersionDropdownNavbarItem({
    mobile,
    docsPluginId,
    dropdownActiveClassDisabled,
    dropdownItemsBefore,
    dropdownItemsAfter,
    ...props
  }: Props): JSX.Element;
}

declare module '@theme/NavbarItem/DocsVersionNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  export type Props = DefaultNavbarItemProps & {
    readonly docsPluginId?: string;
  };
  export default function DocsVersionNavbarItem({
    label: staticLabel,
    to: staticTo,
    docsPluginId,
    ...props
  }: Props): JSX.Element;
}

declare module '@theme/NavbarItem/LocaleDropdownNavbarItem' {
  import type {
    NavLinkProps,
    Props as DefaultNavbarItemProps,
  } from '@theme/NavbarItem/DefaultNavbarItem';
  export type Props = DefaultNavbarItemProps & {
    readonly dropdownItemsBefore: NavLinkProps[];
    readonly dropdownItemsAfter: NavLinkProps[];
  };
  export default function LocaleDropdownNavbarItem({
    mobile,
    dropdownItemsBefore,
    dropdownItemsAfter,
    ...props
  }: Props): JSX.Element;
}

declare module '@theme/NavbarItem/SearchNavbarItem' {
  export type Props = {
    readonly mobile?: boolean;
  };
  export default function SearchNavbarItem({mobile}: Props): JSX.Element | null;
}

declare module '@theme/NavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  import type {Props as SearchNavbarItemProps} from '@theme/NavbarItem/SearchNavbarItem';
  import type {Props as DocsVersionDropdownNavbarItemProps} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
  import type {Props as DocsVersionNavbarItemProps} from '@theme/NavbarItem/DocsVersionNavbarItem';
  export type Props =
    | ({
        readonly type?: 'default' | undefined;
      } & DefaultNavbarItemProps)
    | ({
        readonly type: 'docsVersionDropdown';
      } & DocsVersionDropdownNavbarItemProps)
    | ({
        readonly type: 'docsVersion';
      } & DocsVersionNavbarItemProps)
    | ({
        readonly type: 'search';
      } & SearchNavbarItemProps);
  export default function NavbarItem({type, ...props}: Props): JSX.Element;
}

declare module '@theme/SearchMetadatas' {
  export type Props = {
    locale?: string;
    version?: string;
    tag?: string;
  };
  export default function SearchMetadatas({
    locale,
    version,
    tag,
  }: Props): JSX.Element;
}

declare module '@theme/Seo' {
  import type {Props} from '@theme/Seo';
  export default function Seo({
    title,
    description,
    keywords,
    image,
  }: Props): JSX.Element;
}

declare module '@theme/SkipToContent' {
  function SkipToContent(): JSX.Element;
  export default SkipToContent;
}

declare module '@theme/TOC' {
  import type {TOCItem} from '@docusaurus/types';
  export type TOCProps = {
    readonly toc: readonly TOCItem[];
  };
  function TOC({toc}: TOCProps): JSX.Element;
  export default TOC;
}

declare module '@theme/TOCInline' {
  import type {TOCItem} from '@docusaurus/types';
  export type TOCInlineProps = {
    readonly toc: readonly TOCItem[];
  };
  function TOCInline({toc}: TOCInlineProps): JSX.Element;
  export default TOCInline;
}

declare module '@theme/TabItem' {
  import type {ReactNode} from 'react';
  export type Props = {
    readonly children: ReactNode;
    readonly value: string;
    readonly hidden: boolean;
    readonly className: string;
  };
  function TabItem({children, hidden, className}: Props): JSX.Element;
  export default TabItem;
}

declare module '@theme/Tabs' {
  import type {ReactElement} from 'react';
  import type {Props as TabItemProps} from '@theme/TabItem';
  export type Props = {
    readonly lazy?: boolean;
    readonly block?: boolean;
    readonly children: readonly ReactElement<TabItemProps>[];
    readonly defaultValue?: string;
    readonly values: readonly {
      value: string;
      label: string;
    }[];
    readonly groupId?: string;
    readonly className?: string;
  };
  function Tabs(props: Props): JSX.Element;
  export default Tabs;
}

declare module '@theme/ThemeProvider' {
  import type {ReactNode} from 'react';
  export type Props = {
    readonly children: ReactNode;
  };
  function ThemeProvider(props: Props): JSX.Element;
  export default ThemeProvider;
}

declare module '@theme/ThemedImage' {
  import type {ComponentProps} from 'react';
  export type Props = {
    readonly sources: {
      readonly light: string;
      readonly dark: string;
    };
  } & Omit<ComponentProps<'img'>, 'src'>;
  const ThemedImage: (props: Props) => JSX.Element;
  export default ThemedImage;
}

declare module '@theme/Toggle' {
  import type {ComponentProps} from 'react';
  import Toggle from 'react-toggle';
  export type Props = ComponentProps<typeof Toggle>;
  export default function (props: Props): JSX.Element;
}

declare module '@theme/UserPreferencesProvider' {
  import type {ReactNode} from 'react';
  export type Props = {
    readonly children: ReactNode;
  };
  function UserPreferencesProvider(props: Props): JSX.Element;
  export default UserPreferencesProvider;
}

declare module '@theme/hooks/useAnnouncementBar' {
  export type useAnnouncementBarReturns = {
    readonly isAnnouncementBarClosed: boolean;
    readonly closeAnnouncementBar: () => void;
  };
  const useAnnouncementBar: () => useAnnouncementBarReturns;
  export default useAnnouncementBar;
}

declare module '@theme/hooks/useContextualSearchFilters' {
  type ContextualSearchFilters = {
    locale: string;
    tags: string[];
  };
  export default function useContextualSearchFilters(): ContextualSearchFilters;
}

declare module '@theme/hooks/useHideableNavbar' {
  export type useHideableNavbarReturns = {
    readonly navbarRef: (node: HTMLElement | null) => void;
    readonly isNavbarVisible: boolean;
  };
  const useHideableNavbar: (hideOnScroll: boolean) => useHideableNavbarReturns;
  export default useHideableNavbar;
}

declare module '@theme/hooks/useKeyboardNavigation' {
  function useKeyboardNavigation(): void;
  export default useKeyboardNavigation;
}

declare module '@theme/hooks/useLocationHash' {
  import type {Dispatch, SetStateAction} from 'react';
  export type useLocationHashReturns = readonly [
    string,
    Dispatch<SetStateAction<string>>,
  ];
  function useLocationHash(initialHash: string): useLocationHashReturns;
  export default useLocationHash;
}

declare module '@theme/hooks/useLockBodyScroll' {
  function useLockBodyScroll(lock?: boolean): void;
  export default useLockBodyScroll;
}

declare module '@theme/hooks/usePrismTheme' {
  import defaultTheme from 'prism-react-renderer/themes/palenight';
  const usePrismTheme: () => typeof defaultTheme;
  export default usePrismTheme;
}

declare module '@theme/hooks/useScrollPosition' {
  export type ScrollPosition = {
    scrollX: number;
    scrollY: number;
  };
  const useScrollPosition: (
    effect?: ((position: ScrollPosition) => void) | undefined,
    deps?: unknown[],
  ) => ScrollPosition;
  export default useScrollPosition;
}

declare module '@theme/hooks/useTOCHighlight' {
  function useTOCHighlight(
    linkClassName: string,
    linkActiveClassName: string,
    topOffset: number,
  ): void;
  export default useTOCHighlight;
}

declare module '@theme/hooks/useTabGroupChoice' {
  export type useTabGroupChoiceReturns = {
    readonly tabGroupChoices: {
      readonly [groupId: string]: string;
    };
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
  function useThemeContext(): ThemeContextProps;
  export default useThemeContext;
}

declare module '@theme/hooks/useUserPreferencesContext' {
  export type UserPreferencesContextProps = {
    tabGroupChoices: {
      readonly [groupId: string]: string;
    };
    setTabGroupChoices: (groupId: string, newChoice: string) => void;
    isAnnouncementBarClosed: boolean;
    closeAnnouncementBar: () => void;
  };
  function useUserPreferencesContext(): UserPreferencesContextProps;
  export default useUserPreferencesContext;
}

declare module '@theme/hooks/useWindowSize' {
  const windowSizes: {
    readonly desktop: 'desktop';
    readonly mobile: 'mobile';
  };
  export type WindowSize = keyof typeof windowSizes;
  function useWindowSize(): WindowSize | undefined;
  export {windowSizes};
  export default useWindowSize;
}
