/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  NODE_MAJOR_VERSION,
  NODE_MINOR_VERSION,
  DOCUSAURUS_VERSION,
  DEFAULT_BUILD_DIR_NAME,
  DEFAULT_CONFIG_FILE_NAME,
  BABEL_CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
  SRC_DIR_NAME,
  DEFAULT_STATIC_DIR_NAME,
  OUTPUT_STATIC_ASSETS_DIR_NAME,
  THEME_PATH,
  DEFAULT_I18N_DIR_NAME,
  CODE_TRANSLATIONS_FILE_NAME,
  DEFAULT_PORT,
  DEFAULT_PLUGIN_ID,
  WEBPACK_URL_LOADER_LIMIT,
} from './constants';
export {generate, readOutputHTMLFile} from './emitUtils';
export {
  getFileCommitDate,
  FileNotTrackedError,
  GitNotFoundError,
} from './gitUtils';
export {
  mergeTranslations,
  updateTranslationFileMessages,
  getPluginI18nPath,
  localizePath,
} from './i18nUtils';
export {
  removeSuffix,
  removePrefix,
  mapAsyncSequential,
  findAsyncSequential,
} from './jsUtils';
export {
  normalizeUrl,
  getEditUrl,
  fileToPath,
  encodePath,
  isValidPathname,
  resolvePathname,
  addLeadingSlash,
  addTrailingSlash,
  removeTrailingSlash,
  hasSSHProtocol,
  buildHttpsUrl,
  buildSshUrl,
} from './urlUtils';
export {
  type Tag,
  type TagsListItem,
  type TagModule,
  type FrontMatterTag,
  normalizeFrontMatterTags,
  groupTaggedItems,
} from './tags';
export {
  parseMarkdownHeadingId,
  createExcerpt,
  parseFrontMatter,
  parseMarkdownContentTitle,
  parseMarkdownString,
  writeMarkdownHeadingId,
  type WriteHeadingIDOptions,
} from './markdownUtils';
export {
  type ContentPaths,
  type BrokenMarkdownLink,
  replaceMarkdownLinks,
} from './markdownLinks';
export {type SluggerOptions, type Slugger, createSlugger} from './slugger';
export {
  isNameTooLong,
  shortName,
  posixPath,
  toMessageRelativeFilePath,
  aliasedSitePath,
  escapePath,
  addTrailingPathSeparator,
} from './pathUtils';
export {md5Hash, simpleHash, docuHash} from './hashUtils';
export {
  Globby,
  GlobExcludeDefault,
  createMatcher,
  createAbsoluteFilePathMatcher,
} from './globUtils';
export {getFileLoaderUtils} from './webpackUtils';
export {escapeShellArg} from './shellUtils';
export {
  getDataFilePath,
  getDataFileData,
  getContentPathList,
  findFolderContainingFile,
  getFolderContainingFile,
} from './dataFileUtils';
