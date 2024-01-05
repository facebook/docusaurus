/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {inject} from '@vercel/analytics';
import globalData from '@generated/globalData';
import type {PluginOptions} from '@docusaurus/plugin-vercel-analytics';
// import {Joi} from '@docusaurus/utils-validation';
// import type {
//   OptionValidationContext,
//   ThemeConfig,
//   ThemeConfigValidationContext,
// } from '@docusaurus/types';

const {debug, mode} = globalData['docusaurus-plugin-vercel-analytics']
  ?.default as PluginOptions;

inject({
  mode,
  debug,
});

// export type Options = {
//   trackingID: string | [string, ...string[]];
//   anonymizeIP?: boolean;
// };

// export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
//   anonymizeIP: false,
// };

// const pluginOptionsSchema = Joi.object<PluginOptions>({
//   // We normalize trackingID as a string[]
//   trackingID: Joi.alternatives()
//     .try(
//       Joi.alternatives().conditional(Joi.string().required(), {
//         then: Joi.custom((val: boolean) => [val]),
//       }),
//       Joi.array().items(Joi.string().required()),
//     )
//     .required(),
//   anonymizeIP: Joi.boolean().default(DEFAULT_OPTIONS.anonymizeIP),
// });

// export function validateOptions({
//   validate,
//   options,
// }: OptionValidationContext<Options, PluginOptions>): PluginOptions {
//   return validate(pluginOptionsSchema, options);
// }

// export function validateThemeConfig({
//   themeConfig,
// }: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
//   if ('gtag' in themeConfig) {
//     throw new Error(
//       'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag. More information at https://github.com/facebook/docusaurus/pull/5832.',
//     );
//   }
//   return themeConfig;
// }
