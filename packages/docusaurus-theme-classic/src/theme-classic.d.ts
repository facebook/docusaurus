/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-classic' {
  export type Options = {
    customCss?: string | string[];
  };
}

declare module '@theme/Admonition' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
    readonly type: 'note' | 'tip' | 'danger' | 'info' | 'caution';
    readonly icon?: ReactNode;
    readonly title?: string;
  }
  export default function Admonition(props: Props): JSX.Element;
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
  import type {FrontMatter, Metadata} from '@theme/BlogPostPage';
  import type {Assets} from '@docusaurus/plugin-content-blog';

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
  import type {Metadata} from '@theme/BlogPostPage';
  import type {Assets} from '@docusaurus/plugin-content-blog';

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
  import type {ReactElement} from 'react';

  export interface Props {
    readonly children: string | ReactElement;
    readonly className?: string;
    readonly metastring?: string;
    readonly title?: string;
    readonly language?: string;
  }

  const CodeBlock: (props: Props) => JSX.Element;
  export default CodeBlock;
}

declare module '@theme/DocPaginator' {
  import type {PropNavigation} from '@docusaurus/plugin-content-docs';

  // May be simpler to provide a {navigation: PropNavigation} prop?
  export interface Props extends PropNavigation {}

  export default function DocPaginator(props: Props): JSX.Element;
}

declare module '@theme/DocSidebar' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

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
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly activePath: string;
    readonly onItemClick?: (item: PropSidebarItem) => void;
    readonly level: number;
    readonly tabIndex?: number;
    readonly item: PropSidebarItem;
    readonly index: number;
  }

  export default function DocSidebarItem(props: Props): JSX.Element;
}

declare module '@theme/DocSidebarItems' {
  import type {Props as DocSidebarItemProps} from '@theme/DocSidebarItem';
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

  export type Props = Omit<DocSidebarItemProps, 'item' | 'index'> & {
    readonly items: readonly PropSidebarItem[];
  };

  export default function DocSidebarItems(props: Props): JSX.Element;
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

declare module '@theme/ErrorPageContent' {
  import type ErrorComponent from '@theme/Error';

  const ErrorPageContent: typeof ErrorComponent;
  export default ErrorPageContent;
}

declare module '@theme/Footer' {
  const Footer: () => JSX.Element | null;
  export default Footer;
}

declare module '@theme/Heading' {
  import type {ComponentProps} from 'react';

  type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  export interface Props extends ComponentProps<HeadingType> {
    as: HeadingType;
  }

  export default function Heading(props: Props): JSX.Element;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children?: ReactNode;
    readonly title?: string;
    readonly noFooter?: boolean;
    readonly description?: string;
    readonly image?: string;
    readonly keywords?: string | string[];
    readonly permalink?: string;
    readonly wrapperClassName?: string;
    readonly pageClassName?: string;
    readonly searchMetadata?: {
      readonly version?: string;
      readonly tag?: string;
    };
  }

  export default function Layout(props: Props): JSX.Element;
}

declare module '@theme/LayoutHead' {
  import type {Props as LayoutProps} from '@theme/Layout';

  export interface Props extends Omit<LayoutProps, 'children'> {}

  export default function LayoutHead(props: Props): JSX.Element;
}

declare module '@theme/LayoutProviders' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
  }

  export default function LayoutProviders(props: Props): JSX.Element;
}

declare module '@theme/SearchMetadata' {
  export interface Props {
    readonly locale?: string;
    readonly version?: string;
    readonly tag?: string;
  }

  const SearchMetadata: (props: Props) => JSX.Element;
  export default SearchMetadata;
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
  import type {Props as NavbarNavLinkProps} from '@theme/NavbarItem/NavbarNavLink';

  export type DesktopOrMobileNavBarItemProps = NavbarNavLinkProps & {
    readonly isDropdownItem?: boolean;
    readonly className?: string;
    readonly position?: 'left' | 'right';
  };

  export interface Props extends DesktopOrMobileNavBarItemProps {
    readonly mobile?: boolean;
  }

  export default function DefaultNavbarItem(props: Props): JSX.Element;
}

declare module '@theme/NavbarItem/NavbarNavLink' {
  import type {ReactNode} from 'react';
  import type {LinkProps} from '@docusaurus/Link';

  export type Props = LinkProps & {
    readonly activeBasePath?: string;
    readonly activeBaseRegex?: string;
    readonly exact?: boolean;
    readonly label?: ReactNode;
    readonly prependBaseUrlToHref?: string;
  };

  export default function NavbarNavLink(props: Props): JSX.Element;
}

declare module '@theme/NavbarItem/DropdownNavbarItem' {
  import type {Props as NavbarNavLinkProps} from '@theme/NavbarItem/NavbarNavLink';

  import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';

  export type DesktopOrMobileNavBarItemProps = NavbarNavLinkProps & {
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

declare module '@theme/NavbarItem/DocSidebarNavbarItem' {
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';

  export interface Props extends DefaultNavbarItemProps {
    readonly sidebarId: string;
    readonly docsPluginId?: string;
  }

  const DocSidebarNavbarItem: (props: Props) => JSX.Element;
  export default DocSidebarNavbarItem;
}

declare module '@theme/NavbarItem' {
  import type {ComponentProps} from 'react';
  import type {Props as DefaultNavbarItemProps} from '@theme/NavbarItem/DefaultNavbarItem';
  import type {Props as DocNavbarItemProps} from '@theme/NavbarItem/DocNavbarItem';
  import type {Props as DocSidebarNavbarItemProps} from '@theme/NavbarItem/DocSidebarNavbarItem';
  import type {Props as DocsVersionNavbarItemProps} from '@theme/NavbarItem/DocsVersionNavbarItem';
  import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
  import type {Props as DocsVersionDropdownNavbarItemProps} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
  import type {Props as LocaleDropdownNavbarItemProps} from '@theme/NavbarItem/LocaleDropdownNavbarItem';
  import type {Props as SearchNavbarItemProps} from '@theme/NavbarItem/SearchNavbarItem';

  export type LinkLikeNavbarItemProps =
    | ({readonly type?: 'default'} & DefaultNavbarItemProps)
    | ({readonly type: 'doc'} & DocNavbarItemProps)
    | ({readonly type: 'docsVersion'} & DocsVersionNavbarItemProps)
    | ({readonly type: 'docSidebar'} & DocSidebarNavbarItemProps);

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

declare module '@theme/NavbarItem/utils' {
  export function getInfimaActiveClassName(mobile?: boolean): string;
}

declare module '@theme/PaginatorNavLink' {
  import type {ReactNode} from 'react';
  import type {PropNavigationLink} from '@docusaurus/plugin-content-docs';

  export interface Props extends Omit<PropNavigationLink, 'title'> {
    readonly title: ReactNode;
    readonly subLabel?: JSX.Element;
  }

  export default function PaginatorNavLink(props: Props): JSX.Element;
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
    readonly attributes?: Record<string, unknown>;
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
    readonly values?: readonly {
      value: string;
      label?: string;
      attributes?: Record<string, unknown>;
    }[];
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
  import {Details, type DetailsProps} from '@docusaurus/theme-common';

  export interface Props extends DetailsProps {}
  export default Details;
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
