---
id: 'docusaurus_theme_common_lib'
title: 'Module: docusaurus-theme-common/lib'
sidebar_label: 'docusaurus-theme-common/lib'
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [ReactContextError](../classes/docusaurus_theme_common_lib.ReactContextError.md)

## Type aliases

### ColorMode

Ƭ **ColorMode**: typeof `ColorModes`[keyof typeof `ColorModes`]

#### Defined in

packages/docusaurus-theme-common/lib/contexts/colorMode.d.ts:21

---

### ColorModeConfig

Ƭ **ColorModeConfig**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name                        | Type                  |
| :-------------------------- | :-------------------- |
| `defaultMode`               | `"light"` \| `"dark"` |
| `disableSwitch`             | `boolean`             |
| `respectPrefersColorScheme` | `boolean`             |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:34

---

### DetailsProps

Ƭ **DetailsProps**: { `summary?`: `ReactElement` } & `ComponentProps`<`"details"`\>

#### Defined in

packages/docusaurus-theme-common/lib/components/Details/index.d.ts:8

---

### Footer

Ƭ **Footer**: [`MultiColumnFooter`](docusaurus_theme_common_lib.md#multicolumnfooter) \| [`SimpleFooter`](docusaurus_theme_common_lib.md#simplefooter)

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:83

---

### FooterLinkItem

Ƭ **FooterLinkItem**: { `href?`: `string` ; `html?`: `string` ; `label?`: `string` ; `prependBaseUrlToHref?`: `string` ; `to?`: `string` } & { `[key: string]`: `unknown`; }

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:52

---

### FooterLogo

Ƭ **FooterLogo**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name       | Type                 |
| :--------- | :------------------- |
| `alt?`     | `string`             |
| `height?`  | `string` \| `number` |
| `href?`    | `string`             |
| `src`      | `string`             |
| `srcDark?` | `string`             |
| `width?`   | `string` \| `number` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:61

---

### MultiColumnFooter

Ƭ **MultiColumnFooter**: `FooterBase` & { `links`: { `items`: [`FooterLinkItem`](docusaurus_theme_common_lib.md#footerlinkitem)[] ; `title`: `string` \| `null` }[] }

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:74

---

### Navbar

Ƭ **Navbar**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name           | Type                                                        |
| :------------- | :---------------------------------------------------------- |
| `hideOnScroll` | `boolean`                                                   |
| `items`        | [`NavbarItem`](docusaurus_theme_common_lib.md#navbaritem)[] |
| `logo?`        | [`NavbarLogo`](docusaurus_theme_common_lib.md#navbarlogo)   |
| `style`        | `"dark"` \| `"primary"`                                     |
| `title?`       | `string`                                                    |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:27

---

### NavbarItem

Ƭ **NavbarItem**: { `items?`: [`NavbarItem`](docusaurus_theme_common_lib.md#navbaritem)[] ; `label?`: `string` ; `position?`: `"left"` \| `"right"` ; `type?`: `string` } & { `[key: string]`: `unknown`; }

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:10

---

### NavbarLogo

Ƭ **NavbarLogo**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name       | Type                 |
| :--------- | :------------------- |
| `alt?`     | `string`             |
| `height?`  | `string` \| `number` |
| `href?`    | `string`             |
| `src`      | `string`             |
| `srcDark?` | `string`             |
| `target?`  | `string`             |
| `width?`   | `string` \| `number` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:18

---

### NavbarSecondaryMenuComponent

Ƭ **NavbarSecondaryMenuComponent**<`Props`\>: `ComponentType`<`Props`\>

#### Type parameters

| Name    |
| :------ |
| `Props` |

#### Defined in

packages/docusaurus-theme-common/lib/contexts/navbarSecondaryMenu.d.ts:8

---

### SimpleFooter

Ƭ **SimpleFooter**: `FooterBase` & { `links`: [`FooterLinkItem`](docusaurus_theme_common_lib.md#footerlinkitem)[] }

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:80

---

### TOCHighlightConfig

Ƭ **TOCHighlightConfig**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `linkActiveClassName` | `string` | The class name applied to the active (highlighted) link. |
| `linkClassName` | `string` | A class name that all TOC links share. |
| `maxHeadingLevel` | `number` | **`see`** {@link TOCHighlightConfig.minHeadingLevel} |
| `minHeadingLevel` | `number` | The minimum heading level that the TOC includes. Only headings that are in this range will be eligible as "active heading". |

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useTOCHighlight.d.ts:7

---

### TOCTreeNode

Ƭ **TOCTreeNode**: `Object`

#### Type declaration

| Name | Type |
| :-- | :-- |
| `children` | readonly [`TOCTreeNode`](docusaurus_theme_common_lib.md#toctreenode)[] |
| `id` | `string` |
| `level` | `number` |
| `value` | `string` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/tocUtils.d.ts:8

---

### TagLetterEntry

Ƭ **TagLetterEntry**: `Readonly`<{ `letter`: `string` ; `tags`: [`TagsListItem`](docusaurus_theme_common_lib.md#tagslistitem)[] }\>

#### Defined in

packages/docusaurus-theme-common/lib/utils/tagsUtils.d.ts:13

---

### TagsListItem

Ƭ **TagsListItem**: `Readonly`<{ `count`: `number` ; `name`: `string` ; `permalink`: `string` }\>

#### Defined in

packages/docusaurus-theme-common/lib/utils/tagsUtils.d.ts:8

---

### ThemeConfig

Ƭ **ThemeConfig**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name | Type |
| :-- | :-- |
| `announcementBar?` | `AnnouncementBarConfig` |
| `autoCollapseSidebarCategories` | `boolean` |
| `colorMode` | [`ColorModeConfig`](docusaurus_theme_common_lib.md#colormodeconfig) |
| `docs` | { `versionPersistence`: `DocsVersionPersistence` } |
| `docs.versionPersistence` | `DocsVersionPersistence` |
| `footer?` | [`Footer`](docusaurus_theme_common_lib.md#footer) |
| `hideableSidebar` | `boolean` |
| `image?` | `string` |
| `metadata` | { `[key: string]`: `string`; }[] |
| `navbar` | [`Navbar`](docusaurus_theme_common_lib.md#navbar) |
| `prism` | `PrismConfig` |
| `sidebarCollapsible` | `boolean` |
| `tableOfContents` | `TableOfContents` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:88

---

### UserThemeConfig

Ƭ **UserThemeConfig**: `DeepPartial`<[`ThemeConfig`](docusaurus_theme_common_lib.md#themeconfig)\>

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:106

## Variables

### DEFAULT_SEARCH_TAG

• `Const` **DEFAULT_SEARCH_TAG**: `"default"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-theme-common/lib/utils/searchUtils.d.ts:7

---

### ThemeClassNames

• `Const` **ThemeClassNames**: `Object`

These class names are used to style page layouts in Docusaurus, meant to be targeted by user-provided custom CSS selectors.

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `blog` | {} | - |
| `common` | { `backToTopButton`: `"theme-back-to-top-button"` ; `codeBlock`: `"theme-code-block"` ; `editThisPage`: `"theme-edit-this-page"` ; `lastUpdated`: `"theme-last-updated"` } | Follows the naming convention `theme-{blog,doc,version,page}?-[suffix]` |
| `common.backToTopButton` | `"theme-back-to-top-button"` | - |
| `common.codeBlock` | `"theme-code-block"` | - |
| `common.editThisPage` | `"theme-edit-this-page"` | - |
| `common.lastUpdated` | `"theme-last-updated"` | - |
| `docs` | { `docBreadcrumbs`: `"theme-doc-breadcrumbs"` ; `docFooter`: `"theme-doc-footer"` ; `docFooterEditMetaRow`: `"theme-doc-footer-edit-meta-row"` ; `docFooterTagsRow`: `"theme-doc-footer-tags-row"` ; `docMarkdown`: `"theme-doc-markdown"` ; `docSidebarContainer`: `"theme-doc-sidebar-container"` ; `docSidebarItemCategory`: `"theme-doc-sidebar-item-category"` ; `docSidebarItemLink`: `"theme-doc-sidebar-item-link"` ; `docSidebarMenu`: `"theme-doc-sidebar-menu"` ; `docTocDesktop`: `"theme-doc-toc-desktop"` ; `docTocMobile`: `"theme-doc-toc-mobile"` ; `docVersionBadge`: `"theme-doc-version-badge"` ; `docVersionBanner`: `"theme-doc-version-banner"` ; `docSidebarItemCategoryLevel`: (`level`: `number`) => \`theme-doc-sidebar-item-category-level-${number}\` ; `docSidebarItemLinkLevel`: (`level`: `number`) => \`theme-doc-sidebar-item-link-level-${number}\` } | - |
| `docs.docBreadcrumbs` | `"theme-doc-breadcrumbs"` | - |
| `docs.docFooter` | `"theme-doc-footer"` | - |
| `docs.docFooterEditMetaRow` | `"theme-doc-footer-edit-meta-row"` | - |
| `docs.docFooterTagsRow` | `"theme-doc-footer-tags-row"` | - |
| `docs.docMarkdown` | `"theme-doc-markdown"` | - |
| `docs.docSidebarContainer` | `"theme-doc-sidebar-container"` | - |
| `docs.docSidebarItemCategory` | `"theme-doc-sidebar-item-category"` | - |
| `docs.docSidebarItemLink` | `"theme-doc-sidebar-item-link"` | - |
| `docs.docSidebarMenu` | `"theme-doc-sidebar-menu"` | - |
| `docs.docTocDesktop` | `"theme-doc-toc-desktop"` | - |
| `docs.docTocMobile` | `"theme-doc-toc-mobile"` | - |
| `docs.docVersionBadge` | `"theme-doc-version-badge"` | - |
| `docs.docVersionBanner` | `"theme-doc-version-banner"` | - |
| `docs.docSidebarItemCategoryLevel` | [object Object] | - |
| `docs.docSidebarItemLinkLevel` | [object Object] | - |
| `layout` | {} | - |
| `page` | { `blogListPage`: `"blog-list-page"` ; `blogPostPage`: `"blog-post-page"` ; `blogTagPostListPage`: `"blog-tags-post-list-page"` ; `blogTagsListPage`: `"blog-tags-list-page"` ; `docsDocPage`: `"docs-doc-page"` ; `docsTagDocListPage`: `"docs-tags-doc-list-page"` ; `docsTagsListPage`: `"docs-tags-list-page"` ; `mdxPage`: `"mdx-page"` } | - |
| `page.blogListPage` | `"blog-list-page"` | - |
| `page.blogPostPage` | `"blog-post-page"` | - |
| `page.blogTagPostListPage` | `"blog-tags-post-list-page"` | - |
| `page.blogTagsListPage` | `"blog-tags-list-page"` | - |
| `page.docsDocPage` | `"docs-doc-page"` | - |
| `page.docsTagDocListPage` | `"docs-tags-doc-list-page"` | - |
| `page.docsTagsListPage` | `"docs-tags-list-page"` | - |
| `page.mdxPage` | `"mdx-page"` | - |
| `wrapper` | { `blogPages`: `"blog-wrapper"` ; `docsPages`: `"docs-wrapper"` ; `main`: `"main-wrapper"` ; `mdxPages`: `"mdx-wrapper"` } | - |
| `wrapper.blogPages` | `"blog-wrapper"` | - |
| `wrapper.docsPages` | `"docs-wrapper"` | - |
| `wrapper.main` | `"main-wrapper"` | - |
| `wrapper.mdxPages` | `"mdx-wrapper"` | - |

#### Defined in

packages/docusaurus-theme-common/lib/utils/ThemeClassNames.d.ts:11

---

### isDocsPluginEnabled

• `Const` **isDocsPluginEnabled**: `boolean`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:8

---

### keyboardFocusedClassName

• `Const` **keyboardFocusedClassName**: `"navigation-with-keyboard"`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useKeyboardNavigation.d.ts:8

## Functions

### AnnouncementBarProvider

▸ **AnnouncementBarProvider**(`__namedParameters`): `JSX.Element`

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/announcementBar.d.ts:17

---

### Collapsible

▸ **Collapsible**(`__namedParameters`): `JSX.Element`

A headless component providing smooth and uniform collapsing behavior. The component will be invisible (zero height) when collapsed. Doesn't provide interactivity by itself: collapse state is toggled through props.

#### Parameters

| Name                | Type               |
| :------------------ | :----------------- |
| `__namedParameters` | `CollapsibleProps` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/components/Collapsible/index.d.ts:62

---

### ColorModeProvider

▸ **ColorModeProvider**(`__namedParameters`): `JSX.Element`

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/colorMode.d.ts:22

---

### Details

▸ **Details**(`__namedParameters`): `JSX.Element`

A mostly un-styled `<details>` element with smooth collapsing. Provides some very lightweight styles, but you should bring your UI.

#### Parameters

| Name | Type |
| :-- | :-- |
| `__namedParameters` | [`DetailsProps`](docusaurus_theme_common_lib.md#detailsprops) |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/components/Details/index.d.ts:16

---

### DocSidebarItemsExpandedStateProvider

▸ **DocSidebarItemsExpandedStateProvider**(`__namedParameters`): `JSX.Element`

Should be used to wrap one sidebar category level. This provider syncs the expanded states of all sibling categories, and categories can choose to collapse itself if another one is expanded.

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docSidebarItemsExpandedState.d.ts:26

---

### DocsPreferredVersionContextProvider

▸ **DocsPreferredVersionContextProvider**(`__namedParameters`): `JSX.Element`

This is a maybe-layer. If the docs plugin is not enabled, this provider is a simple pass-through.

#### Parameters

| Name                         | Type      |
| :--------------------------- | :-------- |
| `__namedParameters`          | `Object`  |
| `__namedParameters.children` | `Element` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsPreferredVersion.d.ts:14

---

### DocsSidebarProvider

▸ **DocsSidebarProvider**(`__namedParameters`): `JSX.Element`

Provide the current sidebar to your children.

#### Parameters

| Name                         | Type                         |
| :--------------------------- | :--------------------------- |
| `__namedParameters`          | `Object`                     |
| `__namedParameters.children` | `ReactNode`                  |
| `__namedParameters.items`    | `undefined` \| `PropSidebar` |
| `__namedParameters.name`     | `undefined` \| `string`      |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsSidebar.d.ts:16

---

### DocsVersionProvider

▸ **DocsVersionProvider**(`__namedParameters`): `JSX.Element`

Provide the current version's metadata to your children.

#### Parameters

| Name                         | Type                            |
| :--------------------------- | :------------------------------ |
| `__namedParameters`          | `Object`                        |
| `__namedParameters.children` | `ReactNode`                     |
| `__namedParameters.version`  | `null` \| `PropVersionMetadata` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsVersion.d.ts:12

---

### HtmlClassNameProvider

▸ **HtmlClassNameProvider**(`__namedParameters`): `JSX.Element`

Every layer of this provider will append a class name to the HTML element. There's no consumer for this hook: it's side-effect-only. This wrapper is necessary because Helmet does not "merge" classes.

**`see`** https://github.com/staylor/react-helmet-async/issues/161

#### Parameters

| Name                          | Type        |
| :---------------------------- | :---------- |
| `__namedParameters`           | `Object`    |
| `__namedParameters.children`  | `ReactNode` |
| `__namedParameters.className` | `string`    |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/utils/metadataUtils.d.ts:26

---

### NavbarProvider

▸ **NavbarProvider**(`__namedParameters`): `JSX.Element`

Composes the `NavbarMobileSidebarProvider` and `NavbarSecondaryMenuProvider`. Because the latter depends on the former, they can't be re-ordered.

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/utils/navbarUtils.d.ts:18

---

### NavbarSecondaryMenuFiller

▸ **NavbarSecondaryMenuFiller**<`P`\>(`__namedParameters`): `JSX.Element` \| `null`

This component renders nothing by itself, but it fills the placeholder in the generic secondary menu layout. This reduces coupling between the main layout and the specific page.

This kind of feature is often called portal/teleport/gateway/outlet... Various unmaintained React libs exist. Most up-to-date one: https://github.com/gregberge/react-teleporter Not sure any of those is safe regarding concurrent mode.

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `P`  | extends `object` |

#### Parameters

| Name | Type |
| :-- | :-- |
| `__namedParameters` | `Object` |
| `__namedParameters.component` | [`NavbarSecondaryMenuComponent`](docusaurus_theme_common_lib.md#navbarsecondarymenucomponent)<`P`\> |
| `__namedParameters.props` | `P` |

#### Returns

`JSX.Element` \| `null`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/navbarSecondaryMenu.d.ts:22

---

### PageMetadata

▸ **PageMetadata**(`__namedParameters`): `JSX.Element`

Helper component to manipulate page metadata and override site defaults. Works in the same way as Helmet.

#### Parameters

| Name                | Type                |
| :------------------ | :------------------ |
| `__namedParameters` | `PageMetadataProps` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/utils/metadataUtils.d.ts:19

---

### PluginHtmlClassNameProvider

▸ **PluginHtmlClassNameProvider**(`__namedParameters`): `JSX.Element`

A very thin wrapper around `HtmlClassNameProvider` that adds the plugin ID + name to the HTML class name.

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/utils/metadataUtils.d.ts:34

---

### ScrollControllerProvider

▸ **ScrollControllerProvider**(`__namedParameters`): `JSX.Element`

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/utils/scrollUtils.d.ts:16

---

### TabGroupChoiceProvider

▸ **TabGroupChoiceProvider**(`__namedParameters`): `JSX.Element`

#### Parameters

| Name                         | Type        |
| :--------------------------- | :---------- |
| `__namedParameters`          | `Object`    |
| `__namedParameters.children` | `ReactNode` |

#### Returns

`JSX.Element`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/tabGroupChoice.d.ts:16

---

### createStorageSlot

▸ **createStorageSlot**(`key`, `options?`): `StorageSlot`

Creates an interface to work on a particular key in the storage model. Note that this function only initializes the interface, but doesn't allocate anything by itself (i.e. no side-effects).

The API is fail-safe, since usage of browser storage should be considered unreliable. Local storage might simply be unavailable (iframe + browser security) or operations might fail individually. Please assume that using this API can be a no-op. See also https://github.com/facebook/docusaurus/issues/6036

#### Parameters

| Name                   | Type                                               |
| :--------------------- | :------------------------------------------------- |
| `key`                  | `string`                                           |
| `options?`             | `Object`                                           |
| `options.persistence?` | `"localStorage"` \| `"none"` \| `"sessionStorage"` |

#### Returns

`StorageSlot`

#### Defined in

packages/docusaurus-theme-common/lib/utils/storageUtils.d.ts:24

---

### docVersionSearchTag

▸ **docVersionSearchTag**(`pluginId`, `versionName`): `string`

The search tag to append as each doc's metadata.

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `pluginId`    | `string` |
| `versionName` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-theme-common/lib/utils/searchUtils.d.ts:9

---

### duplicates

▸ **duplicates**<`T`\>(`arr`, `comparator?`): `T`[]

Gets the duplicate values in an array.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `arr` | readonly `T`[] | The array. |
| `comparator?` | (`a`: `T`, `b`: `T`) => `boolean` | Compares two values and returns `true` if they are equal (duplicated). |

#### Returns

`T`[]

Value of the elements `v` that have a preceding element `u` where `comparator(u, v) === true`. Values within the returned array are not guaranteed to be unique.

#### Defined in

packages/docusaurus-theme-common/lib/utils/jsUtils.d.ts:16

---

### findFirstCategoryLink

▸ **findFirstCategoryLink**(`item`): `string` \| `undefined`

Best effort to assign a link to a sidebar category. If the category doesn't have a link itself, we link to the first sub item with a link.

#### Parameters

| Name | Type |
| :-- | :-- |
| `item` | `Expand`<`SidebarItemBase` & { `collapsed`: `boolean` ; `collapsible`: `boolean` ; `label`: `string` ; `type`: `"category"` } & { `href?`: `string` ; `items`: `PropSidebarItem`[] }\> |

#### Returns

`string` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:25

---

### findSidebarCategory

▸ **findSidebarCategory**(`sidebar`, `predicate`): `PropSidebarItemCategory` \| `undefined`

Pure function, similar to `Array#find`, but works on the sidebar tree.

#### Parameters

| Name | Type |
| :-- | :-- |
| `sidebar` | `PropSidebar` |
| `predicate` | (`category`: `Expand`<`SidebarItemBase` & { `collapsed`: `boolean` ; `collapsible`: `boolean` ; `label`: `string` ; `type`: `"category"` } & { `href?`: `string` ; `items`: `PropSidebarItem`[] }\>) => `boolean` |

#### Returns

`PropSidebarItemCategory` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:20

---

### isActiveSidebarItem

▸ **isActiveSidebarItem**(`item`, `activePath`): `boolean`

Checks if a sidebar item should be active, based on the active path.

#### Parameters

| Name         | Type              |
| :----------- | :---------------- |
| `item`       | `PropSidebarItem` |
| `activePath` | `string`          |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:34

---

### isMultiColumnFooterLinks

▸ **isMultiColumnFooterLinks**(`links`): links is Object[]

A rough duck-typing about whether the `footer.links` is intended to be multi- column.

#### Parameters

| Name | Type |
| :-- | :-- |
| `links` | { `items`: [`FooterLinkItem`](docusaurus_theme_common_lib.md#footerlinkitem)[] ; `title`: `null` \| `string` }[] \| [`FooterLinkItem`](docusaurus_theme_common_lib.md#footerlinkitem)[] |

#### Returns

links is Object[]

#### Defined in

packages/docusaurus-theme-common/lib/utils/footerUtils.d.ts:12

---

### isRegexpStringMatch

▸ **isRegexpStringMatch**(`regexAsString?`, `valueToTest?`): `boolean`

Matches a string regex (as provided from the config) against a target in a null-safe fashion, case insensitive and global.

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `regexAsString?` | `string` |
| `valueToTest?`   | `string` |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-theme-common/lib/utils/regexpUtils.d.ts:11

---

### isSamePath

▸ **isSamePath**(`path1`, `path2`): `boolean`

Compare the 2 paths, case insensitive and ignoring trailing slash

#### Parameters

| Name    | Type                    |
| :------ | :---------------------- |
| `path1` | `undefined` \| `string` |
| `path2` | `undefined` \| `string` |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-theme-common/lib/utils/routesUtils.d.ts:11

---

### listStorageKeys

▸ **listStorageKeys**(`storageType?`): `string`[]

Returns a list of all the keys currently stored in browser storage, or an empty list if browser storage can't be accessed.

#### Parameters

| Name           | Type                                               |
| :------------- | :------------------------------------------------- |
| `storageType?` | `"localStorage"` \| `"none"` \| `"sessionStorage"` |

#### Returns

`string`[]

#### Defined in

packages/docusaurus-theme-common/lib/utils/storageUtils.d.ts:31

---

### listTagsByLetters

▸ **listTagsByLetters**(`tags`): [`TagLetterEntry`](docusaurus_theme_common_lib.md#tagletterentry)[]

Takes a list of tags (as provided by the content plugins), and groups them by their initials.

#### Parameters

| Name | Type |
| :-- | :-- |
| `tags` | readonly `Readonly`<{ `count`: `number` ; `name`: `string` ; `permalink`: `string` }\>[] |

#### Returns

[`TagLetterEntry`](docusaurus_theme_common_lib.md#tagletterentry)[]

#### Defined in

packages/docusaurus-theme-common/lib/utils/tagsUtils.d.ts:21

---

### parseCodeBlockTitle

▸ **parseCodeBlockTitle**(`metastring?`): `string`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `metastring?` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-theme-common/lib/utils/codeBlockUtils.d.ts:7

---

### parseLanguage

▸ **parseLanguage**(`className`): `string` \| `undefined`

Gets the language name from the class name (set by MDX). e.g. `"language-javascript"` => `"javascript"`. Returns undefined if there is no language class name.

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `className` | `string` |

#### Returns

`string` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/codeBlockUtils.d.ts:13

---

### parseLines

▸ **parseLines**(`content`, `metastring?`, `language?`): `Object`

Parses the code content, strips away any magic comments, and returns the clean content and the highlighted lines marked by the comments or metastring.

If the metastring contains highlight range, the `content` will be returned as-is without any parsing.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `content` | `string` | The raw code with magic comments. Trailing newline will be trimmed upfront. |
| `metastring?` | `string` | The full metastring, as received from MDX. Highlight range declared here starts at 1. |
| `language?` | `string` | Language of the code block, used to determine which kinds of magic comment styles to enable. |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `code` | `string` | The clean code without any magic comments (only if highlight range isn't present in the metastring). |
| `highlightLines` | `number`[] | The highlighted lines, 0-indexed. e.g. `[0, 1, 4]` means the 1st, 2nd, and 5th lines are highlighted. |

#### Defined in

packages/docusaurus-theme-common/lib/utils/codeBlockUtils.d.ts:28

---

### splitNavbarItems

▸ **splitNavbarItems**<`T`\>(`items`): [leftItems: T[], rightItems: T[]]

Split links by left/right. If position is unspecified, fallback to right.

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `T`  | extends `Object` |

#### Parameters

| Name    | Type  |
| :------ | :---- |
| `items` | `T`[] |

#### Returns

[leftItems: T[], rightItems: T[]]

#### Defined in

packages/docusaurus-theme-common/lib/utils/navbarUtils.d.ts:11

---

### translateTagsPageTitle

▸ **translateTagsPageTitle**(): `string`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Returns

`string`

#### Defined in

packages/docusaurus-theme-common/lib/utils/tagsUtils.d.ts:7

---

### uniq

▸ **uniq**<`T`\>(`arr`): `T`[]

Remove duplicate array items (similar to `_.uniq`)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name  | Type  | Description |
| :---- | :---- | :---------- |
| `arr` | `T`[] | The array.  |

#### Returns

`T`[]

An array with duplicate elements removed by reference comparison.

#### Defined in

packages/docusaurus-theme-common/lib/utils/jsUtils.d.ts:22

---

### useAlternatePageUtils

▸ **useAlternatePageUtils**(): `Object`

Permits to obtain the url of the current page in another locale, useful to generate hreflang meta headers etc...

**`see`** https://developers.google.com/search/docs/advanced/crawling/localized-versions

#### Returns

`Object`

| Name | Type |
| :-- | :-- |
| `createUrl` | (`__namedParameters`: { `fullyQualified`: `boolean` ; `locale`: `string` }) => `string` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/useAlternatePageUtils.d.ts:13

---

### useAnnouncementBar

▸ **useAnnouncementBar**(): `ContextValue`

#### Returns

`ContextValue`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/announcementBar.d.ts:20

---

### useBackToTopButton

▸ **useBackToTopButton**(`__namedParameters`): `Object`

Wires the logic for the back to top button.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `__namedParameters` | `Object` | - |
| `__namedParameters.threshold` | `number` | The minimum vertical scroll position, above which a scroll-up would not cause `shown` to become `true`. This is because BTT is only useful if the user is far down the page. |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `shown` | `boolean` | Whether the button should be displayed. We only show if the user has scrolled up and is on a vertical position greater than `threshold`. |
| `scrollToTop` | () => `void` | A (memoized) handle for starting the scroll, which you can directly plug into the props. |

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useBackToTopButton.d.ts:8

---

### useCollapsible

▸ **useCollapsible**(`__namedParameters`): `Object`

This hook is a very thin wrapper around a `useState`.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `__namedParameters` | `Object` | - |
| `__namedParameters.initialState` | `boolean` \| () => `boolean` | The initial state. Will be non-collapsed by default. |

#### Returns

`Object`

| Name              | Type                                      |
| :---------------- | :---------------------------------------- |
| `collapsed`       | `boolean`                                 |
| `setCollapsed`    | `Dispatch`<`SetStateAction`<`boolean`\>\> |
| `toggleCollapsed` | () => `void`                              |

#### Defined in

packages/docusaurus-theme-common/lib/components/Collapsible/index.d.ts:11

---

### useColorMode

▸ **useColorMode**(): `ContextValue`

#### Returns

`ContextValue`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/colorMode.d.ts:25

---

### useContextualSearchFilters

▸ **useContextualSearchFilters**(): `Object`

Gets the relevant context information for contextual search.

The value is generic and not coupled to Algolia/DocSearch, since we may want to support multiple search engines, or allowing users to use their own search engine solution.

#### Returns

`Object`

| Name     | Type       |
| :------- | :--------- |
| `locale` | `string`   |
| `tags`   | `string`[] |

#### Defined in

packages/docusaurus-theme-common/lib/utils/searchUtils.d.ts:17

---

### useCurrentSidebarCategory

▸ **useCurrentSidebarCategory**(): `PropSidebarItemCategory`

Gets the category associated with the current location. Should only be used on category index pages.

#### Returns

`PropSidebarItemCategory`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:30

---

### useDocById

▸ **useDocById**(`id`): `PropVersionDoc`

A null-safe way to access a doc's data by ID in the active version.

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`PropVersionDoc`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:12

▸ **useDocById**(`id`): `PropVersionDoc` \| `undefined`

A null-safe way to access a doc's data by ID in the active version.

#### Parameters

| Name | Type                    |
| :--- | :---------------------- |
| `id` | `undefined` \| `string` |

#### Returns

`PropVersionDoc` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:16

---

### useDocSidebarItemsExpandedState

▸ **useDocSidebarItemsExpandedState**(): `ContextValue`

#### Returns

`ContextValue`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docSidebarItemsExpandedState.d.ts:29

---

### useDocsPreferredVersion

▸ **useDocsPreferredVersion**(`pluginId?`): `Object`

Returns a read-write interface to a plugin's preferred version. Note, the `preferredVersion` attribute will always be `null` before mount.

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `pluginId?` | `string` |

#### Returns

`Object`

| Name                       | Type                                |
| :------------------------- | :---------------------------------- |
| `preferredVersion`         | `GlobalVersion` \| `null`           |
| `savePreferredVersionName` | (`versionName`: `string`) => `void` |

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsPreferredVersion.d.ts:21

---

### useDocsPreferredVersionByPluginId

▸ **useDocsPreferredVersionByPluginId**(): `Object`

#### Returns

`Object`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsPreferredVersion.d.ts:25

---

### useDocsSidebar

▸ **useDocsSidebar**(): `SidebarContextValue` \| `null`

Gets the sidebar data that's currently displayed, or `null` if there isn't one

#### Returns

`SidebarContextValue` \| `null`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsSidebar.d.ts:24

---

### useDocsVersion

▸ **useDocsVersion**(): `PropVersionMetadata`

Gets the version metadata of the current doc page.

#### Returns

`PropVersionMetadata`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/docsVersion.d.ts:19

---

### useDynamicCallback

▸ **useDynamicCallback**<`T`\>(`callback`): `T`

Permits to transform an unstable callback (like an arrow function provided as props) to a "stable" callback that is safe to use in a `useEffect` dependency array. Useful to avoid React stale closure problems + avoid useless effect re-executions.

Workaround until the React team recommends a good solution, see https://github.com/facebook/react/issues/16956

This generally works but has some potential drawbacks, such as https://github.com/facebook/react/issues/16956#issuecomment-536636418

#### Type parameters

| Name | Type                                        |
| :--- | :------------------------------------------ |
| `T`  | extends (...`args`: `never`[]) => `unknown` |

#### Parameters

| Name       | Type |
| :--------- | :--- |
| `callback` | `T`  |

#### Returns

`T`

#### Defined in

packages/docusaurus-theme-common/lib/utils/reactUtils.d.ts:29

---

### useFilteredAndTreeifiedTOC

▸ **useFilteredAndTreeifiedTOC**(`__namedParameters`): readonly [`TOCTreeNode`](docusaurus_theme_common_lib.md#toctreenode)[]

Takes a flat TOC list (from the MDX loader) and treeifies it into what the TOC components expect, applying the `minHeadingLevel` and `maxHeadingLevel`. Memoized for performance.

**Important**: this is not the same as `useTreeifiedTOC(toc.filter(...))`, because we have to filter the TOC after it has been treeified. This is mostly to ensure that weird TOC structures preserve their semantics. For example, an h3-h2-h4 sequence should not be treeified as an "h3 > h4" hierarchy with min=3, max=4, but should rather be "[h3, h4]" (since the h2 heading has split the two headings and they are not parents)

#### Parameters

| Name                                | Type                 |
| :---------------------------------- | :------------------- |
| `__namedParameters`                 | `Object`             |
| `__namedParameters.maxHeadingLevel` | `number`             |
| `__namedParameters.minHeadingLevel` | `number`             |
| `__namedParameters.toc`             | readonly `TOCItem`[] |

#### Returns

readonly [`TOCTreeNode`](docusaurus_theme_common_lib.md#toctreenode)[]

#### Defined in

packages/docusaurus-theme-common/lib/utils/tocUtils.d.ts:31

---

### useHideableNavbar

▸ **useHideableNavbar**(`hideOnScroll`): `Object`

Wires the imperative logic of a hideable navbar.

#### Parameters

| Name           | Type      | Description                                 |
| :------------- | :-------- | :------------------------------------------ |
| `hideOnScroll` | `boolean` | If `false`, this hook is basically a no-op. |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `isNavbarVisible` | `boolean` | If `false`, the navbar component should not be rendered. |
| `navbarRef` | (`node`: `null` \| `HTMLElement`) => `void` | A ref to the navbar component. Plug this into the actual element. |

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useHideableNavbar.d.ts:11

---

### useHistoryPopHandler

▸ **useHistoryPopHandler**(`handler`): `void`

Permits to register a handler that will be called on history pop navigation (backward/forward). If the handler returns `false`, the backward/forward transition will be blocked. Unfortunately there's no good way to detect the "direction" (backward/forward) of the POP event.

#### Parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `handler` | `HistoryBlockHandler` |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/utils/historyUtils.d.ts:15

---

### useHomePageRoute

▸ **useHomePageRoute**(): `RouteConfig` \| `undefined`

Fetches the route that points to "/". Use this instead of the naive "/", because the homepage may not exist.

#### Returns

`RouteConfig` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/routesUtils.d.ts:25

---

### useIsomorphicLayoutEffect

▸ **useIsomorphicLayoutEffect**(`effect`, `deps?`): `void`

This hook is like `useLayoutEffect`, but without the SSR warning. It seems hacky but it's used in many React libs (Redux, Formik...). Also mentioned here: https://github.com/facebook/react/issues/16956

It is useful when you need to update a ref as soon as possible after a React render (before `useEffect`).

#### Parameters

| Name     | Type             |
| :------- | :--------------- |
| `effect` | `EffectCallback` |
| `deps?`  | `DependencyList` |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/utils/reactUtils.d.ts:16

---

### useKeyboardNavigation

▸ **useKeyboardNavigation**(): `void`

Side-effect that adds the `keyboardFocusedClassName` to the body element when the keyboard has been pressed, or removes it when the mouse is clicked.

The presence of this class name signals that the user may be using keyboard for navigation, and the theme **must** add focus outline when this class name is present. (And optionally not if it's absent, for design purposes)

Inspired by https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useKeyboardNavigation.d.ts:19

---

### useLocalPathname

▸ **useLocalPathname**(): `string`

Get the pathname of current route, without the optional site baseUrl.

- `/docs/myDoc` => `/docs/myDoc`
- `/baseUrl/docs/myDoc` => `/docs/myDoc`

#### Returns

`string`

#### Defined in

packages/docusaurus-theme-common/lib/utils/useLocalPathname.d.ts:12

---

### useLocationChange

▸ **useLocationChange**(`onLocationChange`): `void`

Fires an effect when the location changes (which includes hash, query, etc.). Importantly, doesn't fire when there's no previous location: see https://github.com/facebook/docusaurus/pull/6696

#### Parameters

| Name | Type |
| :-- | :-- |
| `onLocationChange` | (`locationChangeEvent`: { `location`: `Location`<`unknown`\> ; `previousLocation`: `undefined` \| `Location`<`unknown`\> }) => `void` |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/utils/useLocationChange.d.ts:13

---

### useLockBodyScroll

▸ **useLockBodyScroll**(`lock?`): `void`

Side-effect that locks the document body's scroll throughout the lifetime of the containing component. e.g. when the mobile sidebar is expanded.

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `lock?` | `boolean` |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useLockBodyScroll.d.ts:11

---

### useNavbarMobileSidebar

▸ **useNavbarMobileSidebar**(): `ContextValue`

#### Returns

`ContextValue`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/navbarMobileSidebar.d.ts:29

---

### useNavbarSecondaryMenu

▸ **useNavbarSecondaryMenu**(): `Object`

Wires the logic for rendering the mobile navbar secondary menu.

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `content` | `JSX.Element` \| `undefined` | The content returned from the current secondary menu filler. |
| `shown` | `boolean` | Whether secondary menu is displayed. |
| `hide` | () => `void` | Hide the secondary menu; fired either when hiding the entire sidebar, or when going back to the primary menu. |

#### Defined in

packages/docusaurus-theme-common/lib/contexts/navbarSecondaryMenu.d.ts:27

---

### usePluralForm

▸ **usePluralForm**(): `Object`

Reads the current locale and returns an interface very similar to `Intl.PluralRules`.

#### Returns

`Object`

| Name | Type |
| :-- | :-- |
| `selectMessage` | (`count`: `number`, `pluralMessages`: `string`) => `string` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/usePluralForm.d.ts:11

---

### usePrevious

▸ **usePrevious**<`T`\>(`value`): `T` \| `undefined`

Gets `value` from the last render.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name    | Type |
| :------ | :--- |
| `value` | `T`  |

#### Returns

`T` \| `undefined`

#### Defined in

packages/docusaurus-theme-common/lib/utils/reactUtils.d.ts:33

---

### usePrismTheme

▸ **usePrismTheme**(): typeof `defaultTheme`

Returns a color-mode-dependent Prism theme: whatever the user specified in the config. Falls back to `palenight`.

#### Returns

typeof `defaultTheme`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/usePrismTheme.d.ts:12

---

### useScrollController

▸ **useScrollController**(): `ScrollController`

We need a way to update the scroll position while ignoring scroll events so as not to toggle Navbar/BackToTop visibility.

This API permits to temporarily disable/ignore scroll events. Motivated by https://github.com/facebook/docusaurus/pull/5618

#### Returns

`ScrollController`

#### Defined in

packages/docusaurus-theme-common/lib/utils/scrollUtils.d.ts:26

---

### useScrollPosition

▸ **useScrollPosition**(`effect`, `deps?`): `void`

This hook fires an effect when the scroll position changes. The effect will be provided with the before/after scroll positions. Note that the effect may not be always run: if scrolling is disabled through `useScrollController`, it will be a no-op.

**`see`** [useScrollController](docusaurus_theme_common_lib.md#usescrollcontroller)

#### Parameters

| Name | Type |
| :-- | :-- |
| `effect` | (`position`: `ScrollPosition`, `lastPosition`: `null` \| `ScrollPosition`) => `void` |
| `deps?` | `unknown`[] |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/utils/scrollUtils.d.ts:39

---

### useScrollPositionBlocker

▸ **useScrollPositionBlocker**(): `Object`

This hook permits to "block" the scroll position of a DOM element. The idea is that we should be able to update DOM content above this element but the screen position of this element should not change.

Feature motivated by the Tabs groups: clicking on a tab may affect tabs of the same group upper in the tree, yet to avoid a bad UX, the clicked tab must remain under the user mouse.

**`see`** https://github.com/facebook/docusaurus/pull/5618

#### Returns

`Object`

| Name | Type |
| :-- | :-- |
| `blockElementScrollPositionUntilNextRender` | (`el`: `HTMLElement`) => `void` |

#### Defined in

packages/docusaurus-theme-common/lib/utils/scrollUtils.d.ts:51

---

### useSearchPage

▸ **useSearchPage**(): `Object`

Some utility functions around search queries.

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `searchQuery` | `string` | Works hand-in-hand with `setSearchQuery`; whatever the user has inputted into the search box. |
| `generateSearchPageLink` | (`targetSearchQuery`: `string`) => `string` | Given a query, this handle generates the corresponding search page link, with base URL prepended. |
| `setSearchQuery` | (`newSearchQuery`: `string`) => `void` | Set a new search query. In addition to updating `searchQuery`, this handle also mutates the location and appends the query. |

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useSearchPage.d.ts:8

---

### useSidebarBreadcrumbs

▸ **useSidebarBreadcrumbs**(): `PropSidebarBreadcrumbsItem`[] \| `null`

Gets the breadcrumbs of the current doc page, based on its sidebar location. Returns `null` if there's no sidebar or breadcrumbs are disabled.

#### Returns

`PropSidebarBreadcrumbsItem`[] \| `null`

#### Defined in

packages/docusaurus-theme-common/lib/utils/docsUtils.d.ts:39

---

### useSmoothScrollTo

▸ **useSmoothScrollTo**(): `Object`

A "smart polyfill" of `window.scrollTo({ top, behavior: "smooth" })`. This currently always uses a polyfilled implementation unless `scroll-behavior: smooth` has been set in CSS, because native support detection for scroll behavior seems unreliable.

This hook does not do anything by itself: it returns a start and a stop handle. You can execute either handle at any time.

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `cancelScroll` | `CancelScrollTop` | A cancel function, because the non-native smooth scroll-top implementation must be interrupted if user scrolls down. If there's no existing animation or the scroll is using native behavior, this is a no-op. |
| `startScroll` | (`top`: `number`) => `void` | Start the scroll. |

#### Defined in

packages/docusaurus-theme-common/lib/utils/scrollUtils.d.ts:68

---

### useTOCHighlight

▸ **useTOCHighlight**(`config`): `void`

Side-effect that applies the active class name to the TOC heading that the user is currently viewing. Disabled when `config` is undefined.

#### Parameters

| Name | Type |
| :-- | :-- |
| `config` | `undefined` \| [`TOCHighlightConfig`](docusaurus_theme_common_lib.md#tochighlightconfig) |

#### Returns

`void`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useTOCHighlight.d.ts:24

---

### useTabGroupChoice

▸ **useTabGroupChoice**(): `ContextValue`

#### Returns

`ContextValue`

#### Defined in

packages/docusaurus-theme-common/lib/contexts/tabGroupChoice.d.ts:19

---

### useThemeConfig

▸ **useThemeConfig**(): [`ThemeConfig`](docusaurus_theme_common_lib.md#themeconfig)

A convenient/more semantic way to get theme config from context.

#### Returns

[`ThemeConfig`](docusaurus_theme_common_lib.md#themeconfig)

#### Defined in

packages/docusaurus-theme-common/lib/utils/useThemeConfig.d.ts:110

---

### useTitleFormatter

▸ **useTitleFormatter**(`title?`): `string`

Formats the page's title based on relevant site config and other contexts.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `title?` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-theme-common/lib/utils/generalUtils.d.ts:10

---

### useTreeifiedTOC

▸ **useTreeifiedTOC**(`toc`): readonly [`TOCTreeNode`](docusaurus_theme_common_lib.md#toctreenode)[]

Takes a flat TOC list (from the MDX loader) and treeifies it into what the TOC components expect. Memoized for performance.

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `toc` | `TOCItem`[] |

#### Returns

readonly [`TOCTreeNode`](docusaurus_theme_common_lib.md#toctreenode)[]

#### Defined in

packages/docusaurus-theme-common/lib/utils/tocUtils.d.ts:18

---

### useWindowSize

▸ **useWindowSize**(): `WindowSize`

Gets the current window size as an enum value. We don't want it to return the actual width value, so that it only re-renders once a breakpoint is crossed.

It may return `"ssr"`, which is very important to handle hydration FOUC or layout shifts. You have to handle it explicitly upfront. On the server, you may need to render BOTH the mobile/desktop elements (and hide one of them with mediaquery). We don't return `undefined` on purpose, to make it more explicit.

In development mode, this hook will still return `"ssr"` for one second, to catch potential layout shifts, similar to strict mode calling effects twice.

#### Returns

`WindowSize`

#### Defined in

packages/docusaurus-theme-common/lib/hooks/useWindowSize.d.ts:26
