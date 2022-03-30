---
id: 'docusaurus_utils_lib'
title: 'Module: docusaurus-utils/lib'
sidebar_label: 'docusaurus-utils/lib'
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [FileNotTrackedError](../classes/docusaurus_utils_lib.FileNotTrackedError.md)
- [GitNotFoundError](../classes/docusaurus_utils_lib.GitNotFoundError.md)

## Type aliases

### BrokenMarkdownLink

Ƭ **BrokenMarkdownLink**<`T`\>: `Object`

Data structure representing each broken Markdown link to be reported.

#### Type parameters

| Name | Type                                                           |
| :--- | :------------------------------------------------------------- |
| `T`  | extends [`ContentPaths`](docusaurus_utils_lib.md#contentpaths) |

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `contentPaths` | `T` | This is generic because it may contain extra metadata like version name, which the reporter can provide for context. |
| `filePath` | `string` | Absolute path to the file containing this link. |
| `link` | `string` | The content of the link, like `"./brokenFile.md"` |

#### Defined in

packages/docusaurus-utils/lib/markdownLinks.d.ts:23

---

### ContentPaths

Ƭ **ContentPaths**: `Object`

Content plugins have a base path and a localized path to source content from. We will look into the localized path in priority.

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `contentPath` | `string` | The absolute path to the base content directory, like `"<siteDir>/docs"`. |
| `contentPathLocalized` | `string` | The absolute path to the localized content directory, like `"<siteDir>/i18n/zh-Hans/plugin-content-docs"`. |

#### Defined in

packages/docusaurus-utils/lib/markdownLinks.d.ts:11

---

### FrontMatterTag

Ƭ **FrontMatterTag**: `string` \| [`Tag`](docusaurus_utils_lib.md#tag)

#### Defined in

packages/docusaurus-utils/lib/tags.d.ts:12

---

### Slugger

Ƭ **Slugger**: `Object`

#### Type declaration

| Name | Type |
| :-- | :-- |
| `slug` | (`value`: `string`, `options?`: [`SluggerOptions`](docusaurus_utils_lib.md#sluggeroptions)) => `string` |

#### Defined in

packages/docusaurus-utils/lib/slugger.d.ts:11

---

### SluggerOptions

Ƭ **SluggerOptions**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `maintainCase?` | `boolean` | Keep the headings' casing, otherwise make all lowercase. |

#### Defined in

packages/docusaurus-utils/lib/slugger.d.ts:7

---

### Tag

Ƭ **Tag**: `Object`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Type declaration

| Name | Type | Description |
| :-- | :-- | :-- |
| `label` | `string` | - |
| `permalink` | `string` | Permalink to this tag's page, without the `/tags/` base path. |

#### Defined in

packages/docusaurus-utils/lib/tags.d.ts:7

---

### WriteHeadingIDOptions

Ƭ **WriteHeadingIDOptions**: [`SluggerOptions`](docusaurus_utils_lib.md#sluggeroptions) & { `overwrite?`: `boolean` }

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:101

## Variables

### BABEL_CONFIG_FILE_NAME

• `Const` **BABEL_CONFIG_FILE_NAME**: `string`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:22

---

### CODE_TRANSLATIONS_FILE_NAME

• `Const` **CODE_TRANSLATIONS_FILE_NAME**: `"code.json"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:56

---

### DEFAULT_BUILD_DIR_NAME

• `Const` **DEFAULT_BUILD_DIR_NAME**: `"build"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:15

---

### DEFAULT_CONFIG_FILE_NAME

• `Const` **DEFAULT_CONFIG_FILE_NAME**: `"docusaurus.config.js"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:20

---

### DEFAULT_PLUGIN_ID

• `Const` **DEFAULT_PLUGIN_ID**: `"default"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:60

---

### DEFAULT_PORT

• `Const` **DEFAULT_PORT**: `3000`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:58

---

### DEFAULT_STATIC_DIR_NAME

• `Const` **DEFAULT_STATIC_DIR_NAME**: `"static"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:37

---

### GENERATED_FILES_DIR_NAME

• `Const` **GENERATED_FILES_DIR_NAME**: `string`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:27

---

### GlobExcludeDefault

• `Const` **GlobExcludeDefault**: `string`[]

The default glob patterns we ignore when sourcing content.

- Ignore files and folders starting with `_` recursively
- Ignore tests

#### Defined in

packages/docusaurus-utils/lib/globUtils.d.ts:14

---

### I18N_DIR_NAME

• `Const` **I18N_DIR_NAME**: `"i18n"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:52

---

### NODE_MAJOR_VERSION

• `Const` **NODE_MAJOR_VERSION**: `number`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:8

---

### NODE_MINOR_VERSION

• `Const` **NODE_MINOR_VERSION**: `number`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:10

---

### OUTPUT_STATIC_ASSETS_DIR_NAME

• `Const` **OUTPUT_STATIC_ASSETS_DIR_NAME**: `"assets"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:42

---

### SRC_DIR_NAME

• `Const` **SRC_DIR_NAME**: `"src"`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:32

---

### THEME_PATH

• `Const` **THEME_PATH**: `string`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:47

---

### WEBPACK_URL_LOADER_LIMIT

• `Const` **WEBPACK_URL_LOADER_LIMIT**: `string` \| `number`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Defined in

packages/docusaurus-utils/lib/constants.d.ts:67

## Functions

### addLeadingSlash

▸ **addLeadingSlash**(`str`): `string`

Appends a leading slash to `str`, if one doesn't exist.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:51

---

### addTrailingPathSeparator

▸ **addTrailingPathSeparator**(`str`): `string`

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:51

---

### addTrailingSlash

▸ **addTrailingSlash**(`str`): `string`

Appends a trailing slash to `str`, if one doesn't exist.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:53

---

### aliasedSitePath

▸ **aliasedSitePath**(`filePath`, `siteDir`): `string`

Alias filepath relative to site directory, very useful so that we don't expose user's site structure. Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filePath` | `string` |
| `siteDir`  | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:38

---

### buildHttpsUrl

▸ **buildHttpsUrl**(`gitCredentials`, `githubHost`, `organizationName`, `projectName`, `githubPort?`): `string`

Constructs an HTTP URL that can be used to push to GitHub.

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `gitCredentials`   | `string` |
| `githubHost`       | `string` |
| `organizationName` | `string` |
| `projectName`      | `string` |
| `githubPort?`      | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:59

---

### buildSshUrl

▸ **buildSshUrl**(`githubHost`, `organizationName`, `projectName`, `githubPort?`): `string`

Constructs an SSH URL that can be used to push to GitHub.

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `githubHost`       | `string` |
| `organizationName` | `string` |
| `projectName`      | `string` |
| `githubPort?`      | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:57

---

### createAbsoluteFilePathMatcher

▸ **createAbsoluteFilePathMatcher**(`patterns`, `rootFolders`): `Matcher`

We use match patterns like `"** /_* /**"` (ignore the spaces), where `"_*"` should only be matched within a subfolder. This function would:

- Match `/user/sebastien/website/docs/_partials/xyz.md`
- Ignore `/user/_sebastien/website/docs/partials/xyz.md`

**`throws`** Throws when the returned matcher receives a path that doesn't belong to any of the `rootFolders`.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `patterns` | `string`[] | A list of glob patterns. |
| `rootFolders` | `string`[] | A list of root folders to resolve the glob from. |

#### Returns

`Matcher`

A matcher handle that tells if a file path is matched by any of the patterns, resolved from the first root folder that contains the path.

#### Defined in

packages/docusaurus-utils/lib/globUtils.d.ts:38

---

### createExcerpt

▸ **createExcerpt**(`fileString`): `string` \| `undefined`

Creates an excerpt of a Markdown file. This function will:

- Ignore h1 headings (setext or atx)
- Ignore import/export
- Ignore code blocks

And for the first contentful line, it will strip away most Markdown syntax, including HTML tags, emphasis, links (keeping the text), etc.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fileString` | `string` |

#### Returns

`string` \| `undefined`

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:33

---

### createMatcher

▸ **createMatcher**(`patterns`): `Matcher`

A very thin wrapper around `Micromatch.makeRe`.

**`see`** [createAbsoluteFilePathMatcher](docusaurus_utils_lib.md#createabsolutefilepathmatcher)

#### Parameters

| Name       | Type       | Description              |
| :--------- | :--------- | :----------------------- |
| `patterns` | `string`[] | A list of glob patterns. |

#### Returns

`Matcher`

A matcher handle that tells if a file path is matched by any of the patterns.

#### Defined in

packages/docusaurus-utils/lib/globUtils.d.ts:24

---

### createSlugger

▸ **createSlugger**(): [`Slugger`](docusaurus_utils_lib.md#slugger)

A thin wrapper around github-slugger. This is a factory function that returns a stateful Slugger object.

#### Returns

[`Slugger`](docusaurus_utils_lib.md#slugger)

#### Defined in

packages/docusaurus-utils/lib/slugger.d.ts:23

---

### docuHash

▸ **docuHash**(`str`): `string`

Given an input string, convert to kebab-case and append a hash, avoiding name collision. Also removes part of the string if its larger than the allowed filename per OS, avoiding `ERRNAMETOOLONG` error.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/hashUtils.d.ts:16

---

### encodePath

▸ **encodePath**(`userPath`): `string`

Similar to `encodeURI`, but uses `encodeURIComponent` and assumes there's no query.

`encodeURI("/question?/answer")` => `"/question?/answer#section"`; `encodePath("/question?/answer#section")` => `"/question%3F/answer%23foo"`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `userPath` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:38

---

### escapePath

▸ **escapePath**(`str`): `string`

When you have a path like C:\X\Y It is not safe to use directly when generating code For example, this would fail due to unescaped \: `<img src={require('${filePath}')} />` But this would work: `<img src={require('${escapePath(filePath)}')} />`

posixPath can't be used in all cases, because forward slashes are only valid Windows paths when they don't contain non-ascii characters, and posixPath doesn't escape those that fail to be converted.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:50

---

### fileToPath

▸ **fileToPath**(`file`): `string`

Converts file path to a reasonable URL path, e.g. `'index.md'` -> `'/'`, `'foo/bar.js'` -> `'/foo/bar'`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:30

---

### findAsyncSequential

▸ **findAsyncSequential**<`T`\>(`array`, `predicate`): `Promise`<`T` \| `undefined`\>

`Array#find` for async operations where order matters.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `array` | `T`[] | The array to traverse. |
| `predicate` | (`t`: `T`) => `Promise`<`boolean`\> | An async predicate to be called on every array item. Should return a boolean indicating whether the currently element should be returned. |

#### Returns

`Promise`<`T` \| `undefined`\>

The function immediately returns the first item on which `predicate` returns `true`, or `undefined` if none matches the predicate.

#### Defined in

packages/docusaurus-utils/lib/jsUtils.d.ts:28

---

### findFolderContainingFile

▸ **findFolderContainingFile**(`folderPaths`, `relativeFilePath`): `Promise`<`string` \| `undefined`\>

#### Parameters

| Name               | Type       | Description                               |
| :----------------- | :--------- | :---------------------------------------- |
| `folderPaths`      | `string`[] | a list of absolute paths.                 |
| `relativeFilePath` | `string`   | file path relative to each `folderPaths`. |

#### Returns

`Promise`<`string` \| `undefined`\>

the first folder path in which the file exists, or `undefined` if none is found.

#### Defined in

packages/docusaurus-utils/lib/dataFileUtils.d.ts:47

---

### generate

▸ **generate**(`generatedFilesDir`, `file`, `content`, `skipCache?`): `Promise`<`void`\>

Outputs a file to the generated files directory. Only writes files if content differs from cache (for hot reload performance).

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `generatedFilesDir` | `string` | Absolute path. |
| `file` | `string` | Path relative to `generatedFilesDir`. File will always be outputted; no need to ensure directory exists. |
| `content` | `string` | String content to write. |
| `skipCache?` | `boolean` | If `true` (defaults as `true` for production), file is force-rewritten, skipping cache. |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/docusaurus-utils/lib/emitUtils.d.ts:19

---

### getContentPathList

▸ **getContentPathList**(`contentPaths`): `string`[]

Takes the `contentPaths` data structure and returns an ordered path list indicating their priorities. For all data, we look in the localized folder in priority.

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `contentPaths` | [`ContentPaths`](docusaurus_utils_lib.md#contentpaths) |

#### Returns

`string`[]

#### Defined in

packages/docusaurus-utils/lib/dataFileUtils.d.ts:40

---

### getDataFileData

▸ **getDataFileData**<`T`\>(`params`, `validate`): `Promise`<`T` \| `undefined`\>

Looks up for a data file in the content paths, returns the object validated and normalized according to the `validate` callback.

**`throws`** Throws when validation fails, displaying a helpful context message.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name       | Type                                        |
| :--------- | :------------------------------------------ |
| `params`   | `DataFileParams` & { `fileType`: `string` } |
| `validate` | (`content`: `unknown`) => `T`               |

#### Returns

`Promise`<`T` \| `undefined`\>

`undefined` when file not found

#### Defined in

packages/docusaurus-utils/lib/dataFileUtils.d.ts:31

---

### getDataFilePath

▸ **getDataFilePath**(`__namedParameters`): `Promise`<`string` \| `undefined`\>

Looks for a data file in the potential content paths; loads a localized data file in priority.

#### Parameters

| Name                | Type             |
| :------------------ | :--------------- |
| `__namedParameters` | `DataFileParams` |

#### Returns

`Promise`<`string` \| `undefined`\>

An absolute path to the data file, or `undefined` if there isn't one.

#### Defined in

packages/docusaurus-utils/lib/dataFileUtils.d.ts:23

---

### getEditUrl

▸ **getEditUrl**(`fileRelativePath`, `editUrl?`): `string` \| `undefined`

Takes a file's path, relative to its content folder, and computes its edit URL. If `editUrl` is `undefined`, this returns `undefined`, as is the case when the user doesn't want an edit URL in her config.

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `fileRelativePath` | `string` |
| `editUrl?`         | `string` |

#### Returns

`string` \| `undefined`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:25

---

### getFileCommitDate

▸ **getFileCommitDate**(`file`, `args`): `Object`

Fetches the git history of a file and returns a relevant commit date. It gets the commit date instead of author date so that amended commits can have their dates updated.

**`throws`** {GitNotFoundError} If git is not found in `PATH`.

**`throws`** {FileNotTrackedError} If the current file is not tracked by git.

**`throws`** Also throws when `git log` exited with non-zero, or when it outputs unexpected text.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `file` | `string` | - |
| `args` | `Object` | - |
| `args.age?` | `"oldest"` \| `"newest"` | `"oldest"` is the commit that added the file, following renames; `"newest"` is the last commit that edited the file. |
| `args.includeAuthor?` | `false` | Use `includeAuthor: true` to get the author information as well. |

#### Returns

`Object`

| Name        | Type     | Description                                     |
| :---------- | :------- | :---------------------------------------------- |
| `date`      | `Date`   | Relevant commit date.                           |
| `timestamp` | `number` | Timestamp in **seconds**, as returned from git. |

#### Defined in

packages/docusaurus-utils/lib/gitUtils.d.ts:23

▸ **getFileCommitDate**(`file`, `args`): `Object`

Fetches the git history of a file and returns a relevant commit date. It gets the commit date instead of author date so that amended commits can have their dates updated.

**`throws`** {GitNotFoundError} If git is not found in `PATH`.

**`throws`** {FileNotTrackedError} If the current file is not tracked by git.

**`throws`** Also throws when `git log` exited with non-zero, or when it outputs unexpected text.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `file` | `string` | - |
| `args` | `Object` | - |
| `args.age?` | `"oldest"` \| `"newest"` | `"oldest"` is the commit that added the file, following renames; `"newest"` is the last commit that edited the file. |
| `args.includeAuthor` | `true` | - |

#### Returns

`Object`

| Name        | Type     | Description                                     |
| :---------- | :------- | :---------------------------------------------- |
| `author`    | `string` | The author's name, as returned from git.        |
| `date`      | `Date`   | Relevant commit date.                           |
| `timestamp` | `number` | Timestamp in **seconds**, as returned from git. |

#### Defined in

packages/docusaurus-utils/lib/gitUtils.d.ts:49

---

### getFileLoaderUtils

▸ **getFileLoaderUtils**(): `FileLoaderUtils`

Returns unified loader configurations to be used for various file types.

Inspired by https://github.com/gatsbyjs/gatsby/blob/8e6e021014da310b9cc7d02e58c9b3efe938c665/packages/gatsby/src/utils/webpack-utils.ts#L447

#### Returns

`FileLoaderUtils`

#### Defined in

packages/docusaurus-utils/lib/webpackUtils.d.ts:33

---

### getFolderContainingFile

▸ **getFolderContainingFile**(`folderPaths`, `relativeFilePath`): `Promise`<`string`\>

Fail-fast alternative to `findFolderContainingFile`.

**`throws`** Throws if no file can be found. You should use this method only when you actually know the file exists (e.g. when the `relativeFilePath` is read with a glob and you are just trying to localize it)

#### Parameters

| Name               | Type       | Description                               |
| :----------------- | :--------- | :---------------------------------------- |
| `folderPaths`      | `string`[] | a list of absolute paths.                 |
| `relativeFilePath` | `string`   | file path relative to each `folderPaths`. |

#### Returns

`Promise`<`string`\>

the first folder path in which the file exists.

#### Defined in

packages/docusaurus-utils/lib/dataFileUtils.d.ts:58

---

### getPluginI18nPath

▸ **getPluginI18nPath**(`__namedParameters`): `string`

Takes everything needed and constructs a plugin i18n path. Plugins should expect everything it needs for translations to be found under this path.

#### Parameters

| Name                           | Type       |
| :----------------------------- | :--------- |
| `__namedParameters`            | `Object`   |
| `__namedParameters.locale`     | `string`   |
| `__namedParameters.pluginId?`  | `string`   |
| `__namedParameters.pluginName` | `string`   |
| `__namedParameters.siteDir`    | `string`   |
| `__namedParameters.subPaths?`  | `string`[] |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/i18nUtils.d.ts:21

---

### groupTaggedItems

▸ **groupTaggedItems**<`Item`\>(`items`, `getItemTags`): `Object`

Permits to group docs/blog posts by tag (provided by front matter).

#### Type parameters

| Name   |
| :----- |
| `Item` |

#### Parameters

| Name | Type |
| :-- | :-- |
| `items` | readonly `Item`[] |
| `getItemTags` | (`item`: `Item`) => readonly [`Tag`](docusaurus_utils_lib.md#tag)[] |

#### Returns

`Object`

a map from tag permalink to the items and other relevant tag data. The record is indexed by permalink, because routes must be unique in the end. Labels may vary on 2 MD files but they are normalized. Docs with label='some label' and label='some-label' should end up in the same page.

#### Defined in

packages/docusaurus-utils/lib/tags.d.ts:39

---

### hasSSHProtocol

▸ **hasSSHProtocol**(`sourceRepoUrl`): `boolean`

Whether the current URL is an SSH protocol. In addition to looking for `ssh:`, it will also allow protocol-less URLs like `git@github.com:facebook/docusaurus.git`.

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `sourceRepoUrl` | `string` |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:65

---

### isNameTooLong

▸ **isNameTooLong**(`str`): `boolean`

Copyright (c) Facebook, Inc. and its affiliates.

This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:7

---

### isValidPathname

▸ **isValidPathname**(`str`): `boolean`

Whether `str` is a valid pathname. It must be absolute, and not contain special characters.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:43

---

### localizePath

▸ **localizePath**(`__namedParameters`): `string`

Takes a path and returns a localized a version (which is basically `path + i18n.currentLocale`).

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `__namedParameters` | `Object` | - |
| `__namedParameters.i18n` | `I18n` | The current i18n context. |
| `__namedParameters.options?` | `Object` | - |
| `__namedParameters.options.localizePath?` | `boolean` | By default, we don't localize the path of defaultLocale. This option would override that behavior. Setting `false` is useful for `yarn build -l zh-Hans` to always emit into the root build directory. |
| `__namedParameters.path` | `string` | The path, URL or file path, to be localized. |
| `__namedParameters.pathType` | `"fs"` \| `"url"` | FS paths will treat Windows specially; URL paths will always have a trailing slash to make it a valid base URL. |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/i18nUtils.d.ts:32

---

### mapAsyncSequential

▸ **mapAsyncSequential**<`T`, `R`\>(`array`, `action`): `Promise`<`R`[]\>

`Array#map` for async operations where order matters.

#### Type parameters

| Name |
| :--- |
| `T`  |
| `R`  |

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `array` | `T`[] | The array to traverse. |
| `action` | (`t`: `T`) => `Promise`<`R`\> | An async action to be performed on every array item. Will be awaited before working on the next. |

#### Returns

`Promise`<`R`[]\>

The list of results returned from every `action(item)`

#### Defined in

packages/docusaurus-utils/lib/jsUtils.d.ts:19

---

### md5Hash

▸ **md5Hash**(`str`): `string`

Thin wrapper around `crypto.createHash("md5")`.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/hashUtils.d.ts:8

---

### mergeTranslations

▸ **mergeTranslations**(`contents`): `TranslationFileContent`

Takes a list of translation file contents, and shallow-merges them into one.

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `contents` | `TranslationFileContent`[] |

#### Returns

`TranslationFileContent`

#### Defined in

packages/docusaurus-utils/lib/i18nUtils.d.ts:11

---

### normalizeFrontMatterTags

▸ **normalizeFrontMatterTags**(`tagsPath`, `frontMatterTags?`): [`Tag`](docusaurus_utils_lib.md#tag)[]

Takes tag objects as they are defined in front matter, and normalizes each into a standard tag object. The permalink is created by appending the sluggified label to `tagsPath`. Front matter tags already containing permalinks would still have `tagsPath` prepended.

The result will always be unique by permalinks. The behavior with colliding permalinks is undetermined.

#### Parameters

| Name | Type |
| :-- | :-- |
| `tagsPath` | `string` |
| `frontMatterTags?` | [`FrontMatterTag`](docusaurus_utils_lib.md#frontmattertag)[] |

#### Returns

[`Tag`](docusaurus_utils_lib.md#tag)[]

#### Defined in

packages/docusaurus-utils/lib/tags.d.ts:22

---

### normalizeUrl

▸ **normalizeUrl**(`rawUrls`): `string`

Much like `path.join`, but much better. Takes an array of URL segments, and joins them into a reasonable URL.

- `["file:", "/home", "/user/", "website"]` => `file:///home/user/website`
- `["file://", "home", "/user/", "website"]` => `file://home/user/website` (relative!)
- Remove trailing slash before parameters or hash.
- Replace `?` in query parameters with `&`.
- Dedupe forward slashes in the entire path, avoiding protocol slashes.

**`throws`** {TypeError} If any of the URL segment is not a string, this throws.

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `rawUrls` | `string`[] |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:19

---

### parseFrontMatter

▸ **parseFrontMatter**(`markdownFileContent`): `Object`

Takes a raw Markdown file content, and parses the front matter using gray-matter. Worth noting that gray-matter accepts TOML and other markup languages as well.

**`throws`** Throws when gray-matter throws. e.g.:

```md
---
foo: : bar
---
```

#### Parameters

| Name                  | Type     |
| :-------------------- | :------- |
| `markdownFileContent` | `string` |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `content` | `string` | The remaining content, trimmed. |
| `frontMatter` | { `[key: string]`: `unknown`; } | Front matter as parsed by gray-matter. |

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:46

---

### parseMarkdownContentTitle

▸ **parseMarkdownContentTitle**(`contentUntrimmed`, `options?`): `Object`

Takes the raw Markdown content, without front matter, and tries to find an h1 title (setext or atx) to be used as metadata.

It only searches until the first contentful paragraph, ignoring import/export declarations.

It will try to convert markdown to reasonable text, but won't be best effort, since it's only used as a fallback when `frontMatter.title` is not provided. For now, we just unwrap inline code (`` # `config.js`  `` => `config.js`).

#### Parameters

| Name               | Type                               |
| :----------------- | :--------------------------------- |
| `contentUntrimmed` | `string`                           |
| `options?`         | `ParseMarkdownContentTitleOptions` |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `content` | `string` | The content, optionally without the content title. |
| `contentTitle` | `string` \| `undefined` | The title, trimmed and without the `#`. |

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:74

---

### parseMarkdownHeadingId

▸ **parseMarkdownHeadingId**(`heading`): `Object`

Parses custom ID from a heading. The ID must be composed of letters, underscores, and dashes only.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `heading` | `string` | e.g. `## Some heading {#some-heading}` where the last character must be `}` for the ID to be recognized |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `id?` | `string` | The heading ID. e.g. `some-heading` |
| `text` | `string` | The heading content sans the ID part, right-trimmed. e.g. `## Some heading` |

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:15

---

### parseMarkdownString

▸ **parseMarkdownString**(`markdownFileContent`, `options?`): `Object`

Makes a full-round parse.

**`throws`** Throws when `parseFrontMatter` throws, usually because of invalid syntax.

#### Parameters

| Name                  | Type                               |
| :-------------------- | :--------------------------------- |
| `markdownFileContent` | `string`                           |
| `options?`            | `ParseMarkdownContentTitleOptions` |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `content` | `string` | Content without front matter and (optionally) without title, depending on the `removeContentTitle` option. |
| `contentTitle` | `string` \| `undefined` | **`see`** [parseMarkdownContentTitle](docusaurus_utils_lib.md#parsemarkdowncontenttitle) |
| `excerpt` | `string` \| `undefined` | **`see`** [createExcerpt](docusaurus_utils_lib.md#createexcerpt) |
| `frontMatter` | { `[key: string]`: `unknown`; } | **`see`** [parseFrontMatter](docusaurus_utils_lib.md#parsefrontmatter) |

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:86

---

### posixPath

▸ **posixPath**(`str`): `string`

Convert Windows backslash paths to posix style paths. E.g: endi\lie -> endi/lie

Returns original path if the posix counterpart is not valid Windows path. This makes the legacy code that uses posixPath safe; but also makes it less useful when you actually want a path with forward slashes (e.g. for URL)

Adopted from https://github.com/sindresorhus/slash/blob/main/index.js

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:19

---

### readOutputHTMLFile

▸ **readOutputHTMLFile**(`permalink`, `outDir`, `trailingSlash`): `Promise`<`Buffer`\>

**`throws`** Throws when the HTML file is not found at any of the potential paths. This should never happen as it would lead to a 404.

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `permalink` | `string` | The URL that the HTML file corresponds to, without base URL |
| `outDir` | `string` | Full path to the output directory |
| `trailingSlash` | `undefined` \| `boolean` | The site config option. If provided, only one path will be read. |

#### Returns

`Promise`<`Buffer`\>

This returns a buffer, which you have to decode string yourself if needed. (Not always necessary since the output isn't for human consumption anyways, and most HTML manipulation libs accept buffers)

#### Defined in

packages/docusaurus-utils/lib/emitUtils.d.ts:31

---

### removePrefix

▸ **removePrefix**(`str`, `prefix`): `string`

Removes a given string prefix from `str`.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `str`    | `string` |
| `prefix` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/jsUtils.d.ts:11

---

### removeSuffix

▸ **removeSuffix**(`str`, `suffix`): `string`

Removes a given string suffix from `str`.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `str`    | `string` |
| `suffix` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/jsUtils.d.ts:9

---

### removeTrailingSlash

▸ **removeTrailingSlash**(`str`): `string`

Removes the trailing slash from `str`.

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:55

---

### replaceMarkdownLinks

▸ **replaceMarkdownLinks**<`T`\>(`__namedParameters`): `Object`

Takes a Markdown file and replaces relative file references with their URL counterparts, e.g. `[link](./intro.md)` => `[link](/docs/intro)`, preserving everything else.

This method uses best effort to find a matching file. The file reference can be relative to the directory of the current file (most likely) or any of the content paths (so `/tutorials/intro.md` can be resolved as `<siteDir>/docs/tutorials/intro.md`). Links that contain the `http(s):` or `@site/` prefix will always be ignored.

#### Type parameters

| Name | Type                                                           |
| :--- | :------------------------------------------------------------- |
| `T`  | extends [`ContentPaths`](docusaurus_utils_lib.md#contentpaths) |

#### Parameters

| Name | Type | Description |
| :-- | :-- | :-- |
| `__namedParameters` | `Object` | - |
| `__namedParameters.contentPaths` | `T` | The content paths which the file reference may live in. |
| `__namedParameters.filePath` | `string` | Absolute path to the current file containing `fileString`. |
| `__namedParameters.fileString` | `string` | The Markdown file content to be processed. |
| `__namedParameters.siteDir` | `string` | Absolute path to the site directory, used to resolve aliased paths. |
| `__namedParameters.sourceToPermalink` | `Object` | A map from source paths to their URLs. Source paths are `@site` aliased. |

#### Returns

`Object`

| Name | Type | Description |
| :-- | :-- | :-- |
| `brokenMarkdownLinks` | [`BrokenMarkdownLink`](docusaurus_utils_lib.md#brokenmarkdownlink)<`T`\>[] | The list of broken links, |
| `newContent` | `string` | The content with all Markdown file references replaced with their URLs. Unresolved links are left as-is. |

#### Defined in

packages/docusaurus-utils/lib/markdownLinks.d.ts:47

---

### reportMessage

▸ **reportMessage**(`message`, `reportingSeverity`): `void`

Takes a message and reports it according to the severity that the user wants.

- `ignore`: completely no-op
- `log`: uses the `INFO` log level
- `warn`: uses the `WARN` log level
- `error`: uses the `ERROR` log level
- `throw`: aborts the process, throws the error.

Since the logger doesn't have logging level filters yet, these severities mostly just differ by their colors.

**`throws`** In addition to throwing when `reportingSeverity === "throw"`, this function also throws if `reportingSeverity` is not one of the above.

#### Parameters

| Name                | Type                |
| :------------------ | :------------------ |
| `message`           | `string`            |
| `reportingSeverity` | `ReportingSeverity` |

#### Returns

`void`

#### Defined in

packages/docusaurus-utils/lib/jsUtils.d.ts:44

---

### resolvePathname

▸ **resolvePathname**(`to`, `from?`): `string`

Resolve pathnames and fail-fast if resolution fails. Uses standard URL semantics (provided by `resolve-pathname` which is used internally by React router)

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `to`    | `string` |
| `from?` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/urlUtils.d.ts:49

---

### shortName

▸ **shortName**(`str`): `string`

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:8

---

### simpleHash

▸ **simpleHash**(`str`, `length`): `string`

Creates an MD5 hash and truncates it to the given length.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `str`    | `string` |
| `length` | `number` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/hashUtils.d.ts:10

---

### toMessageRelativeFilePath

▸ **toMessageRelativeFilePath**(`filePath`): `string`

When you want to display a path in a message/warning/error, it's more convenient to:

- make it relative to `cwd()`
- convert to posix (ie not using windows \ path separator)

This way, Jest tests can run more reliably on any computer/CI on both Unix/Windows For Windows users this is not perfect (as they see / instead of \) but it's probably good enough

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/pathUtils.d.ts:32

---

### updateTranslationFileMessages

▸ **updateTranslationFileMessages**(`translationFile`, `updateMessage`): `TranslationFile`

Useful to update all the messages of a translation file. Used in tests to simulate translations.

#### Parameters

| Name              | Type                              |
| :---------------- | :-------------------------------- |
| `translationFile` | `TranslationFile`                 |
| `updateMessage`   | (`message`: `string`) => `string` |

#### Returns

`TranslationFile`

#### Defined in

packages/docusaurus-utils/lib/i18nUtils.d.ts:16

---

### writeMarkdownHeadingId

▸ **writeMarkdownHeadingId**(`content`, `options?`): `string`

Takes Markdown content, returns new content with heading IDs written. Respects existing IDs (unless `overwrite=true`) and never generates colliding IDs (through the slugger).

#### Parameters

| Name | Type |
| :-- | :-- |
| `content` | `string` |
| `options?` | [`WriteHeadingIDOptions`](docusaurus_utils_lib.md#writeheadingidoptions) |

#### Returns

`string`

#### Defined in

packages/docusaurus-utils/lib/markdownUtils.d.ts:110
