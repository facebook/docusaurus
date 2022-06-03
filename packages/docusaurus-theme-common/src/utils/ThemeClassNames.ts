/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Please do not modify the classnames! This is a breaking change, and annoying
// for users!

/**
 * These class names are used to style page layouts in Docusaurus, meant to be
 * targeted by user-provided custom CSS selectors.
 */
export const ThemeClassNames = {
  page: {
    blogListPage: 'blog-list-page',
    blogPostPage: 'blog-post-page',
    blogTagsListPage: 'blog-tags-list-page',
    blogTagPostListPage: 'blog-tags-post-list-page',

    docsDocPage: 'docs-doc-page',
    docsTagsListPage: 'docs-tags-list-page',
    docsTagDocListPage: 'docs-tags-doc-list-page',

    mdxPage: 'mdx-page',
  },
  wrapper: {
    main: 'main-wrapper',
    blogPages: 'blog-wrapper',
    docsPages: 'docs-wrapper',
    mdxPages: 'mdx-wrapper',
  },
  common: {
    editThisPage: 'theme-edit-this-page',
    lastUpdated: 'theme-last-updated',
    backToTopButton: 'theme-back-to-top-button',
    codeBlock: 'theme-code-block',
    admonition: 'theme-admonition',
    admonitionType: (type: 'note' | 'tip' | 'danger' | 'info' | 'caution') =>
      `theme-admonition-${type}`,
  },
  layout: {
    // TODO add other stable classNames here
  },

  /**
   * Follows the naming convention "theme-{blog,doc,version,page}?-<suffix>"
   */
  docs: {
    docVersionBanner: 'theme-doc-version-banner',
    docVersionBadge: 'theme-doc-version-badge',
    docBreadcrumbs: 'theme-doc-breadcrumbs',
    docMarkdown: 'theme-doc-markdown',
    docTocMobile: 'theme-doc-toc-mobile',
    docTocDesktop: 'theme-doc-toc-desktop',
    docFooter: 'theme-doc-footer',
    docFooterTagsRow: 'theme-doc-footer-tags-row',
    docFooterEditMetaRow: 'theme-doc-footer-edit-meta-row',
    docSidebarContainer: 'theme-doc-sidebar-container',
    docSidebarMenu: 'theme-doc-sidebar-menu',
    docSidebarItemCategory: 'theme-doc-sidebar-item-category',
    docSidebarItemLink: 'theme-doc-sidebar-item-link',
    docSidebarItemCategoryLevel: (level: number) =>
      `theme-doc-sidebar-item-category-level-${level}` as const,
    docSidebarItemLinkLevel: (level: number) =>
      `theme-doc-sidebar-item-link-level-${level}` as const,
    // TODO add other stable classNames here
  },
  blog: {
    // TODO add other stable classNames here
  },
} as const;
