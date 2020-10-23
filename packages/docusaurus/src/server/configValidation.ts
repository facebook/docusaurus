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
  logValidationBugReportHint,
  isValidationDisabledEscapeHatch,
  URISchema,
} from '@docusaurus/utils-validation';

export const DEFAULT_CONFIG: Pick<
  DocusaurusConfig,
  | 'onBrokenLinks'
  | 'onDuplicateRoutes'
  | 'plugins'
  | 'themes'
  | 'presets'
  | 'customFields'
  | 'themeConfig'
  | 'titleDelimiter'
  | 'noIndex'
> = {
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'warn',
  plugins: [],
  themes: [],
  presets: [],
  customFields: {},
  themeConfig: {},
  titleDelimiter: '|',
  noIndex: false,
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

// TODO move to @docusaurus/utils-validation
const ConfigSchema = Joi.object({
  baseUrl: Joi.string()
    .required()
    .regex(new RegExp('/$', 'm'))
    .message('{{#label}} must be a string with a trailing `/`'),
  favicon: Joi.string().required(),
  title: Joi.string().required(),
  url: URISchema.required(),
  onBrokenLinks: Joi.string()
    .equal('ignore', 'log', 'warn', 'error', 'throw')
    .default(DEFAULT_CONFIG.onBrokenLinks),
  onDuplicateRoutes: Joi.string()
    .equal('ignore', 'log', 'warn', 'error', 'throw')
    .default(DEFAULT_CONFIG.onDuplicateRoutes),
  organizationName: Joi.string().allow(''),
  projectName: Joi.string().allow(''),
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
    })
      // See https://github.com/facebook/docusaurus/issues/3378
      .unknown(),
  ),
  ssrTemplate: Joi.string(),
  stylesheets: Joi.array().items(
    Joi.string(),
    Joi.object({
      href: Joi.string().required(),
      type: Joi.string().required(),
    }).unknown(),
  ),
  clientModules: Joi.array().items(Joi.string()),
  tagline: Joi.string().allow(''),
  titleDelimiter: Joi.string().default('|'),
  noIndex: Joi.bool().default(false),
});

// TODO move to @docusaurus/utils-validation
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
