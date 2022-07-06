/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  ReportingSeverity,
  ThemeConfig,
  DocusaurusConfig,
  Config,
} from './config';

export {
  SiteMetadata,
  DocusaurusContext,
  GlobalData,
  LoadContext,
  Props,
} from './context';

export {ClientModule} from './clientModule';

export {
  SwizzleAction,
  SwizzleActionStatus,
  SwizzleConfig,
  SwizzleComponentConfig,
  WrapperProps,
} from './swizzle';

export {
  I18nConfig,
  I18nLocaleConfig,
  I18n,
  CodeTranslations,
  TranslationFileContent,
  TranslationMessage,
  TranslationFile,
} from './i18n';

export {
  Plugin,
  InitializedPlugin,
  LoadedPlugin,
  PluginModule,
  PluginOptions,
  PluginConfig,
  PluginContentLoadedActions,
  PluginVersionInformation,
  Preset,
  PresetConfig,
  PresetModule,
  OptionValidationContext,
  ThemeConfigValidationContext,
  Validate,
  ValidationSchema,
  AllContent,
  ConfigureWebpackUtils,
  PostCssOptions,
  HtmlTagObject,
  HtmlTags,
} from './plugin';

export {
  RouteConfig,
  RouteContext,
  PluginRouteContext,
  Registry,
  RouteChunkNames,
  RouteModules,
  Module,
  ChunkNames,
} from './routing';

export {UseDataOptions} from './utils';
