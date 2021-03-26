/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocusaurusConfig, I18nConfig} from '@docusaurus/types';
import {DEFAULT_CONFIG_FILE_NAME} from '../constants';
import {
  Joi,
  logValidationBugReportHint,
  isValidationDisabledEscapeHatch,
  URISchema,
} from '@docusaurus/utils-validation';

const DEFAULT_I18N_LOCALE = 'en';

export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLocale: DEFAULT_I18N_LOCALE,
  locales: [DEFAULT_I18N_LOCALE],
  localeConfigs: {},
};

export const DEFAULT_CONFIG: Pick<
  DocusaurusConfig,
  | 'i18n'
  | 'onBrokenLinks'
  | 'onBrokenMarkdownLinks'
  | 'onDuplicateRoutes'
  | 'plugins'
  | 'themes'
  | 'presets'
  | 'customFields'
  | 'themeConfig'
  | 'titleDelimiter'
  | 'noIndex'
  | 'baseUrlIssueBanner'
> = {
  i18n: DEFAULT_I18N_CONFIG,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  plugins: [],
  themes: [],
  presets: [],
  customFields: {},
  themeConfig: {},
  titleDelimiter: '|',
  noIndex: false,
  baseUrlIssueBanner: true,
};

const PluginSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array()
    .ordered(Joi.string().required(), Joi.object().required())
    .length(2),
  Joi.bool().equal(false), // In case of conditional adding of plugins.
);

const ThemeSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string().required(), Joi.object().required()).length(2),
);

const PresetSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string().required(), Joi.object().required()).length(2),
);

const LocaleConfigSchema = Joi.object({
  label: Joi.string(),
  direction: Joi.string().equal('ltr', 'rtl').default('ltr'),
});

const I18N_CONFIG_SCHEMA = Joi.object<I18nConfig>({
  defaultLocale: Joi.string().required(),
  locales: Joi.array().items().min(1).items(Joi.string().required()).required(),
  localeConfigs: Joi.object()
    .pattern(/.*/, LocaleConfigSchema)
    .default(DEFAULT_I18N_CONFIG.localeConfigs),
})
  .optional()
  .default(DEFAULT_I18N_CONFIG);

// TODO move to @docusaurus/utils-validation
const ConfigSchema = Joi.object({
  baseUrl: Joi.string()
    .required()
    .regex(new RegExp('/$', 'm'))
    .message('{{#label}} must be a string with a trailing `/`'),
  baseUrlIssueBanner: Joi.boolean().default(DEFAULT_CONFIG.baseUrlIssueBanner),
  favicon: Joi.string().required(),
  title: Joi.string().required(),
  url: URISchema.required(),
  i18n: I18N_CONFIG_SCHEMA,
  onBrokenLinks: Joi.string()
    .equal('ignore', 'log', 'warn', 'error', 'throw')
    .default(DEFAULT_CONFIG.onBrokenLinks),
  onBrokenMarkdownLinks: Joi.string()
    .equal('ignore', 'log', 'warn', 'error', 'throw')
    .default(DEFAULT_CONFIG.onBrokenMarkdownLinks),
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
      ? `${formattedError}These field(s) [${unknownFields}] are not recognized in ${DEFAULT_CONFIG_FILE_NAME}.\nIf you still want these fields to be in your configuration, put them in the 'customFields' attribute.\nSee https://docusaurus.io/docs/docusaurus.config.js/#customfields`
      : formattedError;
    throw new Error(formattedError);
  } else {
    return value;
  }
}
