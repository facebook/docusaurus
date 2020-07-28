/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocusaurusConfig} from '@docusaurus/types';
import {CONFIG_FILE_NAME} from '../constants';
import Joi from '@hapi/joi';
import {
  isValidationDisabledEscapeHatch,
  logValidationBugReportHint,
} from './validationUtils';

export const DEFAULT_CONFIG: Pick<
  DocusaurusConfig,
  | 'onBrokenLinks'
  | 'plugins'
  | 'themes'
  | 'presets'
  | 'customFields'
  | 'themeConfig'
> = {
  onBrokenLinks: 'throw',
  plugins: [],
  themes: [],
  presets: [],
  customFields: {},
  themeConfig: {},
};

const PluginSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string().required(), Joi.object().required()).length(2),
);

const ThemeSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string().required(), Joi.object().required()).length(2),
);

const PresetSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string().required(), Joi.object().required()).length(2),
);

const ConfigSchema = Joi.object({
  baseUrl: Joi.string()
    .required()
    .regex(new RegExp('/$', 'm'))
    .message('{{#label}} must be a string with a trailing `/`'),
  favicon: Joi.string().required(),
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  onBrokenLinks: Joi.string()
    .equal('ignore', 'log', 'error', 'throw')
    .default(DEFAULT_CONFIG.onBrokenLinks),
  organizationName: Joi.string(),
  projectName: Joi.string(),
  customFields: Joi.object().unknown().default(DEFAULT_CONFIG.customFields),
  githubHost: Joi.string(),
  plugins: Joi.array().items(PluginSchema).default(DEFAULT_CONFIG.plugins),
  themes: Joi.array().items(ThemeSchema).default(DEFAULT_CONFIG.themes),
  presets: Joi.array().items(PresetSchema).default(DEFAULT_CONFIG.presets),
  themeConfig: Joi.object().unknown().default(DEFAULT_CONFIG.themeConfig),
  scripts: Joi.array().items(
    Joi.string(),
    Joi.object({
      src: Joi.string().required(),
      async: Joi.bool(),
      defer: Joi.bool(),
    }),
  ),
  stylesheets: Joi.array().items(
    Joi.string(),
    Joi.object({
      href: Joi.string().required(),
      type: Joi.string().required(),
    }).unknown(),
  ),
  tagline: Joi.string(),
});

export function validateConfig(
  config: Partial<DocusaurusConfig>,
): DocusaurusConfig {
  const {error, value} = ConfigSchema.validate(config, {
    abortEarly: false,
  });
  if (error) {
    logValidationBugReportHint();
    if (isValidationDisabledEscapeHatch) {
      console.error(error);
      return config as DocusaurusConfig;
    }

    const unknownFields = error.details.reduce((formattedError, err) => {
      if (err.type === 'object.unknown') {
        return `${formattedError}"${err.path}",`;
      }
      return formattedError;
    }, '');
    let formattedError = error.details.reduce(
      (accumulatedErr, err) =>
        err.type !== 'object.unknown'
          ? `${accumulatedErr}${err.message}\n`
          : accumulatedErr,
      '',
    );
    formattedError = unknownFields
      ? `${formattedError}These field(s) [${unknownFields}] are not recognized in ${CONFIG_FILE_NAME}.\nIf you still want these fields to be in your configuration, put them in the 'customFields' attribute.\nSee https://v2.docusaurus.io/docs/docusaurus.config.js/#customfields`
      : formattedError;
    throw new Error(formattedError);
  } else {
    return value;
  }
}
