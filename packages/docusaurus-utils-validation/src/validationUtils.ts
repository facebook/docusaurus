/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from 'joi';
import chalk from 'chalk';
import {PluginIdSchema} from './validationSchemas';

// TODO temporary escape hatch for alpha-60: to be removed soon
// Our validation schemas might be buggy at first
// will permit users to bypass validation until we fix all validation errors
// see for example: https://github.com/facebook/docusaurus/pull/3120
// Undocumented on purpose, as we don't want users to keep using it over time
// Maybe we'll make this escape hatch official some day, with a better api?
export const isValidationDisabledEscapeHatch =
  process.env.DISABLE_DOCUSAURUS_VALIDATION === 'true';

if (isValidationDisabledEscapeHatch) {
  console.error(
    chalk.red(
      'You should avoid using DISABLE_DOCUSAURUS_VALIDATION escape hatch, this will be removed',
    ),
  );
}

export const logValidationBugReportHint = () => {
  console.log(
    `\n${chalk.red('A validation error occured.')}${chalk.cyanBright(
      '\nThe validation system was added recently to Docusaurus as an attempt to avoid user configuration errors.' +
        '\nWe may have made some mistakes.' +
        '\nIf you think your configuration is valid and should keep working, please open a bug report.',
    )}\n`,
  );
};

export function normalizePluginOptions<T extends {id?: string}>(
  schema: Joi.ObjectSchema<T>,
  options: unknown,
) {
  // All plugins can be provided an "id" option (multi-instance support)
  // we add schema validation automatically
  const finalSchema = schema.append({
    id: PluginIdSchema,
  });
  const {error, value} = finalSchema.validate(options, {
    convert: false,
  });
  if (error) {
    logValidationBugReportHint();
    if (isValidationDisabledEscapeHatch) {
      console.error(error);
      return options;
    } else {
      throw error;
    }
  }
  return value;
}

export function normalizeThemeConfig<T>(
  schema: Joi.ObjectSchema<T>,
  themeConfig: unknown,
) {
  // A theme should only validate his "slice" of the full themeConfig,
  // not the whole object, so we allow unknown attributes
  // otherwise one theme would fail validating the data of another theme
  const finalSchema = schema.unknown();

  const {error, value} = finalSchema.validate(themeConfig, {
    convert: false,
  });

  if (error) {
    logValidationBugReportHint();
    if (isValidationDisabledEscapeHatch) {
      console.error(error);
      return themeConfig;
    } else {
      throw error;
    }
  }
  return value;
}
