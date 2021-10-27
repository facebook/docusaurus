/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/plugin-content-blog" />
/// <reference types="@docusaurus/plugin-content-docs" />
/// <reference types="@docusaurus/plugin-content-pages" />

declare module '@docusaurus/theme-classic' {
  export type Options = Partial<import('./index').PluginOptions>;
}

declare module '@theme/AnnouncementBar' {
  const AnnouncementBar: () => JSX.Element | null;
  export default AnnouncementBar;
}

declare module '@theme/BackToTopButton' {
  export default function BackToTopButton(): JSX.Element;
}

declare module '@theme/BlogListPaginator' {
  import type {Metadata} from '@theme/BlogListPage';

  export interface Props {
    readonly metadata: Metadata;
  }

  const BlogListPaginator: (props: Props) => JSX.Element;
  export default BlogListPaginator;
}

declare module '@theme/BlogPostItem' {
  import type {FrontMatter, Assets, Metadata} from '@theme/BlogPostPage';

  export interface Props {
    readonly frontMatter: FrontMatter;
    readonly assets: Assets;
    readonly metadata: Metadata;
    readonly truncated?: string | boolean;
    readonly isBlogPostPage?: boolean;
    readonly children: JSX.Element;
  }

  const BlogPostItem: (props: Props) => JSX.Element;
  export default BlogPostItem;
}

declare module '@theme/BlogPostAuthor' {
  import type {Metadata} from '@theme/BlogPostPage';

  export interface Props {
    readonly author: Metadata['authors'][number];
  }

  export default function BlogPostAuthor(props: Props): JSX.Element;
}

declare module '@theme/BlogPostAuthors' {
  import type {Metadata, Assets} from '@theme/BlogPostPage';

  export interface Props {
    readonly authors: Metadata['authors'];
    readonly assets: Assets;
  }

  export default function BlogPostAuthors(props: Props): JSX.Element;
}

declare module '@theme/BlogPostPaginator' {
  type Item = {readonly title: string; readonly permalink: string};

  export interface Props {
    readonly nextItem?: Item;
    readonly prevItem?: Item;
  }

  const BlogPostPaginator: (props: Props) => JSX.Element;
  export default BlogPostPaginator;
}

declare module '@theme/BlogLayout' {
  import type {ReactNode} from 'react';
  import type {Props as LayoutProps} from '@theme/Layout';
  import type {BlogSidebar} from '@theme/BlogSidebar';

  export interface Props extends LayoutProps {
    readonly sidebar?: BlogSidebar;
    readonly toc?: ReactNode;
  }

  const BlogLayout: (props: Props) => JSX.Element;
  export default BlogLayout;
}

declare module '@theme/CodeBlock' {
  import {ReactElement} from 'react';

  export interface Props {
    readonly children: string | ReactElement;
    readonly className?: string;
    readonly metastring?: string;
    readonly title?: string;
  }

  const CodeBlock: (props: Props) => JSX.Element;
  export default CodeBlock;
}

declare module '@theme/DocPaginator' {
  type PageInfo = {readonly permalink: string; readonly title: string};

  export interface Props {
    readonly metadata: {readonly previous?: PageInfo; readonly next?: PageInfo};
  }

  const DocPaginator: (props: Props) => JSX.Element;
  export default DocPaginator;
}

declare module '@theme/DocSidebar' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';

  export interface Props {
    readonly path: string;
    readonly sidebar: readonly PropSidebarItem[];
    readonly onCollapse: () => void;
    readonly isHidden: boolean;
    // MobileSecondaryFilter expects Record<string, unknown>
    readonly [key: string]: unknown;
  }

  const DocSidebar: (props: Props) => JSX.Element;
  export default DocSidebar;
}

declare module '@theme/DocSidebarItem' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';

  type DocSidebarPropsBase = {
    readonly activePath: string;
    readonly onItemClick?: () => void;
    readonly level: number;
    readonly tabIndex?: number;
  };

  export interface Props extends DocSidebarPropsBase {
    readonly item: PropSidebarItem;
  }
  const DocSidebarItem: (props: Props) => JSX.Element;
  export default DocSidebarItem;

  export type DocSidebarItemsProps = DocSidebarPropsBase & {
    readonly items: readonly PropSidebarItem[];
  };
  export const DocSidebarItems: (props: DocSidebarItemsProps) => JSX.Element;
}

declare module '@theme/DocVersionSuggestions' {
  const DocVersionSuggestions: () => JSX.Element;
  export default DocVersionSuggestions;
}

declare module '@theme/EditThisPage' {
  export interface Props {
    readonly editUrl: string;
  }
  const EditThisPage: (props: Props) => JSX.Element;
  export default EditThisPage;
}

declare module '@theme/Footer' {
  const Footer: () => JSX.Element | null;
  export default Footer;
}

declare module '@theme/Heading' {
  import type {ComponentProps} from 'react';

  export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  export interface Props extends ComponentProps<HeadingType> {}

  const Heading: (Tag: HeadingType) => (props: Props) => JSX.Element;
  export default Heading;
  export const MainHeading: (props: Props) => JSX.Element;
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

declare module '@theme/hooks/usePrismTheme' {
  import defaultTheme from 'prism-react-renderer/themes/palenight';

  const usePrismTheme: () => typeof defaultTheme;
  export default usePrismTheme;
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

declare module '@theme/hooks/useUserPreferencesContext' {
  export type UserPreferencesContextProps = {
    tabGroupChoices: {readonly [groupId: string]: string};
    setTabGroupChoices: (groupId: string, newChoice: string) => void;
  };

  export default function useUserPreferencesContext(): UserPreferencesContextProps;
}

declare module '@theme/hooks/useWindowSize' {
  export const windowSizes: {
    desktop: 'desktop';
    mobile: 'mobile';
    ssr: 'ssr';
  };

  export type WindowSize = keyof typeof windowSizes;

  export default function useWindowSize(): WindowSize;
}

declare module '@theme/hooks/useKeyboardNavigation' {
  const useKeyboardNavigation: () => void;

  export default useKeyboardNavigation;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
    readonly title?: string;
    readonly noFooter?: boolean;
    readonly description?: string;
    readonly image?: string;
    readonly keywords?: string | string[];
    readonly permalink?: string;
    readonly wrapperClassName?: string;
    readonly pageClassName?: string;
    readonly searchMetadatas?: {
      readonly version?: string;
      readonly tag?: string;
    };
  }

  const Layout: (props: Props) => JSX.Element;
  export default Layout;
}

declare module '@theme/LayoutHead' {
  import type {Props as LayoutProps} from '@theme/Layout';

  export interface Props extends Omit<LayoutProps, 'children'> {}

  const LayoutHead: (props: Props) => JSX.Element;
  export default LayoutHead;
}

declare module '@theme/SearchMetadatas' {
  export interface Props {
    readonly locale?: string;
    readonly version?: string;
    readonly tag?: string;
  }

  const SearchMetadatas: (props: Props) => JSX.Element;
  export default SearchMetadatas;
}

declare module '@theme/LastUpdated' {
  export interface Props {
    readonly lastUpdatedAt?: number;
    readonly formattedLastUpdatedAt?: string;
    readonly lastUpdatedBy?: string;
  }

  const LastUpdated: (props: Props) => JSX.Element;
  export default LastUpdated;
}

declare module '@theme/SkipToContent' {
  const SkipToContent: () => JSX.Element;
  export default SkipToContent;
}

declare module '@theme/MDXComponents' {
  import type {ComponentProps} from 'react';
  import type CodeBlock from '@theme/CodeBlock';
  import type Head from '@docusaurus/Head';

  export type MDXComponentsObject = {
    readonly head: typeof Head;
    readonly code: typeof CodeBlock;
    readonly a: (props: ComponentProps<'a'>) => JSX.Element;
    readonly pre: typeof CodeBlock;
    readonly details: (props: ComponentProps<'details'>) => JSX.Element;
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
  import type {ReactNode} from 'react';
  import type {LinkProps} from '@docusaurus/Link';

  export type NavLinkProps = LinkProps & {
    readonly activeBasePath?: string;
    readonly activeBaseRegex?: string;
    readonly exact?: boolean;
    readonly label?: ReactNode;
    readonly prependBaseUrlToHref?: string;
  };

  export type DesktopOrMobileNavBarItemProps = NavLinkProps & {
    readonly isDropdownItem?: boolean;
    readonly className?: string;
    readonly position?: 'left' | 'right';
  };

  export interface Props extends DesktopOrMobileNavBarItemProps {
    readonly mobile?: boolean;
  }

  export const NavLink: (props: NavLinkProps) => JSX.Element;

  const DefaultNavbarItem: (props: Props) => JSX.Element;
  export default DefaultNavbarItem;
}

declare module '@theme/NavbarItem/DropdownNavbarItem' {
  import type {NavLinkProps} from '@theme/NavbarItem/DefaultNavbarItem';
  import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';

  export type DesktopOrMobileNavBarItemProps = NavLinkProps & {
    readonly position?: 'left' | 'right';
    readonly items: readonly LinkLikeNavbarItemProps[];
    readonly className?: string;
  };

  export interface Props extends DesktopOrMobileNavBarItemProps {
    readonly mobile?: boolean;
  }

  const DropdownNavbarItem: (props: Props) => JSX.Element;
  export default DropdownNavbarItem;
}

declare module '@theme/NavbarItem/SearchNavbarItem' {
  export interface Props {
    readonly mobile?: boolean;
  }

  const SearchNavbarItem: (props: Props) => JSX.Element;
  export default SearchNavbarItem;
}

declare module '@theme/NavbarItem/LocaleDropdownNavbarItem' {
  import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
  import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';

  export interface Props extends DropdownNavbarItemProps {
    readonly dropdownItemsBefore: LinkLikeNavbarItemProps[];
    readonly dropdownItemsAfter: LinkLikeNavbarItemProps[];
  }

  const LocaleDropdownNavbarItem: (props: Props) => JSX.Element;
  export default LocaleDropdownNavbarItem;
}

declare module '@theme/NavbarItem/DocsVersionDropdownNavbarItem' {
  import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
  import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';

  export interface Props extends DropdownNavbarItemProps {
    readonly docsPluginId?: string;
    readonly dropdownActiveClassDisabled?: boolean;
    readonly dropdownItemsBefore: LinkLikeNavbarItemProps[];
    readonly dropdownItemsAfter: LinkLikeNavbarItemProps[];
  }

  const DocsVersionDropdownNavbarItem: (props: Props) => JSX.Element;
  export default DocsVersionDropdownNavbarItem;
}

declare module '@theme/NavbarItem/DocsVersionNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';

  export interface Props extends DefaultNavbarItemProps {
    readonly docsPluginId?: string;
  }

  const DocsVersionNavbarItem: (props: Props) => JSX.Element;
  export default DocsVersionNavbarItem;
}

declare module '@theme/NavbarItem/DocNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';

  export interface Props extends DefaultNavbarItemProps {
    readonly docId: string;
    readonly docsPluginId?: string;
  }

  const DocsSidebarNavbarItem: (props: Props) => JSX.Element;
  export default DocsSidebarNavbarItem;
}

declare module '@theme/NavbarItem' {
  import type {ComponentProps} from 'react';
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  import type {Props as DocNavbarItemProps} from '@theme/NavbarItem/DocNavbarItem';
  import type {Props as DocsVersionNavbarItemProps} from '@theme/NavbarItem/DocsVersionNavbarItem';
  import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
  import type {Props as DocsVersionDropdownNavbarItemProps} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
  import type {Props as LocaleDropdownNavbarItemProps} from '@theme/NavbarItem/LocaleDropdownNavbarItem';
  import type {Props as SearchNavbarItemProps} from '@theme/NavbarItem/SearchNavbarItem';

  export type LinkLikeNavbarItemProps =
    | ({readonly type?: 'default'} & DefaultNavbarItemProps)
    | ({readonly type: 'doc'} & DocNavbarItemProps)
    | ({readonly type: 'docsVersion'} & DocsVersionNavbarItemProps);

  export type Props = ComponentProps<'a'> & {
    readonly position?: 'left' | 'right';
  } & (
      | LinkLikeNavbarItemProps
      | ({readonly type?: 'dropdown'} & DropdownNavbarItemProps)
      | ({
          readonly type: 'docsVersionDropdown';
        } & DocsVersionDropdownNavbarItemProps)
      | ({readonly type: 'localeDropdown'} & LocaleDropdownNavbarItemProps)
      | ({
          readonly type: 'search';
        } & SearchNavbarItemProps)
    );

  export type Types = Props['type'];

  const NavbarItem: (props: Props) => JSX.Element;
  export default NavbarItem;
}

declare module '@theme/SearchBar' {
  export default function SearchBar(): JSX.Element;
}

declare module '@theme/TabItem' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
    readonly value: string;
    readonly default?: boolean;
    readonly label?: string;
    readonly hidden?: boolean;
    readonly className?: string;
  }

  const TabItem: (props: Props) => JSX.Element;
  export default TabItem;
}

declare module '@theme/Tabs' {
  import type {ReactElement} from 'react';
  import type {Props as TabItemProps} from '@theme/TabItem';

  export interface Props {
    readonly lazy?: boolean;
    readonly block?: boolean;
    readonly children: readonly ReactElement<TabItemProps>[];
    readonly defaultValue?: string | null;
    readonly values?: readonly {value: string; label?: string}[];
    readonly groupId?: string;
    readonly className?: string;
  }

  const Tabs: (props: Props) => JSX.Element;
  export default Tabs;
}

declare module '@theme/ThemedImage' {
  import type {ComponentProps} from 'react';

  export interface Props extends Omit<ComponentProps<'img'>, 'src'> {
    readonly sources: {
      readonly light: string;
      readonly dark: string;
    };
  }

  const ThemedImage: (props: Props) => JSX.Element;
  export default ThemedImage;
}

declare module '@theme/Details' {
  import {Details, DetailsProps} from '@docusaurus/theme-common';

  export interface Props extends DetailsProps {}
  export default Details;
}

declare module '@theme/ThemeProvider' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
  }

  const ThemeProvider: (props: Props) => JSX.Element;
  export default ThemeProvider;
}

declare module '@theme/TOCItems' {
  import type {TOCItem} from '@docusaurus/types';

  export type TOCItemsProps = {
    readonly toc: readonly TOCItem[];
    readonly minHeadingLevel?: number;
    readonly maxHeadingLevel?: number;
    readonly className?: string;
    readonly linkClassName?: string | null;
    readonly linkActiveClassName?: string;
  };

  export default function TOCItems(props: TOCItemsProps): JSX.Element;
}

declare module '@theme/TOC' {
  import type {TOCItem} from '@docusaurus/types';

  // minHeadingLevel only exists as a per-doc option,
  // and won't have a default set by Joi. See TOC, TOCInline,
  // TOCCollapsible for examples
  export type TOCProps = {
    readonly toc: readonly TOCItem[];
    readonly minHeadingLevel?: number;
    readonly maxHeadingLevel?: number;
    readonly className?: string;
  };

  export type TOCHeadingsProps = {
    readonly toc: readonly TOCItem[];
    readonly minHeadingLevel?: number;
    readonly maxHeadingLevel?: number;
  };

  export const TOCHeadings: (props: TOCHeadingsProps) => JSX.Element;

  const TOC: (props: TOCProps) => JSX.Element;
  export default TOC;
}

declare module '@theme/TOCInline' {
  import type {TOCItem} from '@docusaurus/types';

  export type TOCInlineProps = {
    readonly toc: readonly TOCItem[];
    readonly minHeadingLevel?: number;
    readonly maxHeadingLevel?: number;
  };

  const TOCInline: (props: TOCInlineProps) => JSX.Element;
  export default TOCInline;
}

declare module '@theme/TOCCollapsible' {
  import type {TOCItem} from '@docusaurus/types';

  export type TOCCollapsibleProps = {
    readonly className?: string;
    readonly minHeadingLevel?: number;
    readonly maxHeadingLevel?: number;
    readonly toc: readonly TOCItem[];
  };

  const TOCCollapsible: (props: TOCCollapsibleProps) => JSX.Element;
  export default TOCCollapsible;
}

declare module '@theme/Toggle' {
  import type {SyntheticEvent} from 'react';

  export interface Props {
    readonly className?: string;
    readonly checked: boolean;
    readonly onChange: (e: SyntheticEvent) => void;
  }

  const Toggle: (props: Props) => JSX.Element;
  export default Toggle;
}

declare module '@theme/UserPreferencesProvider' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
  }

  const UserPreferencesProvider: (props: Props) => JSX.Element;
  export default UserPreferencesProvider;
}

declare module '@theme/LayoutProviders' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
  }

  const LayoutProviders: (props: Props) => JSX.Element;
  export default LayoutProviders;
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

declare module '@theme/Logo' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'a'> {
    readonly imageClassName?: string;
    readonly titleClassName?: string;
  }

  const Logo: (props: Props) => JSX.Element;
  export default Logo;
}

declare module '@theme/IconArrow' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconArrow: (props: Props) => JSX.Element;
  export default IconArrow;
}

declare module '@theme/IconEdit' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconEdit: (props: Props) => JSX.Element;
  export default IconEdit;
}

declare module '@theme/IconMenu' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconMenu: (props: Props) => JSX.Element;
  export default IconMenu;
}

declare module '@theme/IconClose' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconClose: (props: Props) => JSX.Element;
  export default IconClose;
}

declare module '@theme/IconLanguage' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconLanguage: (props: Props) => JSX.Element;
  export default IconLanguage;
}

declare module '@theme/IconExternalLink' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {}

  const IconExternalLink: (props: Props) => JSX.Element;
  export default IconExternalLink;
}

declare module '@theme/TagsListByLetter' {
  export type TagsListItem = Readonly<{
    name: string;
    permalink: string;
    count: number;
  }>;
  export interface Props {
    readonly tags: readonly TagsListItem[];
  }
  export default function TagsListByLetter(props: Props): JSX.Element;
}

declare module '@theme/TagsListInline' {
  export type Tag = Readonly<{label: string; permalink: string}>;
  export interface Props {
    readonly tags: readonly Tag[];
  }
  export default function TagsListInline(props: Props): JSX.Element;
}

declare module '@theme/Tag' {
  import type {TagsListItem} from '@theme/TagsListByLetter';
  import type {Optional} from 'utility-types';

  export interface Props extends Optional<TagsListItem, 'count'> {}

  export default function Tag(props: Props): JSX.Element;
}

declare module '@theme/prism-include-languages' {
  import type * as PrismNamespace from 'prismjs';

  export default function prismIncludeLanguages(
    PrismObject: typeof PrismNamespace,
  ): void;
}

declare module 'prism-react-renderer/prism' {
  import type * as PrismNamespace from 'prismjs';

  const Prism: typeof PrismNamespace;
  export default Prism;
}
