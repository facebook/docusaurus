/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export default function pluginVercelAnalytics(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-vercel-analytics',

    getClientModules() {
      return isProd ? ['./analytics'] : [];
    },

    contentLoaded({actions}) {
      console.log('options:', options);
      if (options.id !== DEFAULT_PLUGIN_ID) {
        throw new Error(
          `You cannot use a custom plugin id option with the Vercel Analytics plugin`,
        );
      }
      actions.setGlobalData(options);
    },
  };
}

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  mode: 'production',
  debug: false,
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  mode: Joi.string()
    .valid('auto', 'production', 'development')
    .default(DEFAULT_OPTIONS.mode),
  debug: Joi.boolean().default(DEFAULT_OPTIONS.debug),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}

export type {PluginOptions, Options};
