/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Joi from './Joi';
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
      'You should avoid using DISABLE_DOCUSAURUS_VALIDATION escape hatch, this will be removed.',
    ),
  );
}

export const logValidationBugReportHint = (): void => {
  console.log(
    `\n${chalk.red('A validation error occurred.')}${chalk.cyanBright(
      '\nThe validation system was added recently to Docusaurus as an attempt to avoid user configuration errors.' +
        '\nWe may have made some mistakes.' +
        '\nIf you think your configuration is valid and should keep working, please open a bug report.',
    )}\n`,
  );
};

export function printWarning(warning?: Joi.ValidationError): void {
  if (warning) {
    const warningMessages = warning.details
      .map(({message}) => message)
      .join('\n');
    console.log(chalk.yellow(warningMessages));
  }
}

export function normalizePluginOptions<T extends {id?: string}>(
  schema: Joi.ObjectSchema<T>,
  options: Partial<T>,
): T {
  // All plugins can be provided an "id" option (multi-instance support)
  // we add schema validation automatically
  const finalSchema = schema.append({
    id: PluginIdSchema,
  });
  const {error, warning, value} = finalSchema.validate(options, {
    convert: false,
  });

  printWarning(warning);

  if (error) {
    logValidationBugReportHint();
    if (isValidationDisabledEscapeHatch) {
      console.error(error);
      return options as T;
    } else {
      throw error;
    }
  }

  return value;
}

export function normalizeThemeConfig<T>(
  schema: Joi.ObjectSchema<T>,
  themeConfig: Partial<T>,
): T {
  // A theme should only validate his "slice" of the full themeConfig,
  // not the whole object, so we allow unknown attributes
  // otherwise one theme would fail validating the data of another theme
  const finalSchema = schema.unknown();

  const {error, warning, value} = finalSchema.validate(themeConfig, {
    convert: false,
  });

  printWarning(warning);

  if (error) {
    logValidationBugReportHint();
    if (isValidationDisabledEscapeHatch) {
      console.error(error);
      return themeConfig as T;
    } else {
      throw error;
    }
  }
  return value;
}

export function validateFrontMatter<T>(
  frontMatter: Record<string, unknown>,
  schema: Joi.ObjectSchema<T>,
): T {
  const {value, error, warning} = schema.validate(frontMatter, {
    convert: true,
    allowUnknown: true,
    abortEarly: false,
  });

  printWarning(warning);

  if (error) {
    const frontMatterString = JSON.stringify(frontMatter, null, 2);
    const errorDetails = error.details;
    const invalidFields = errorDetails.map(({path}) => path).join(', ');
    const errorMessages = errorDetails
      .map(({message}) => ` - ${message}`)
      .join('\n');

    logValidationBugReportHint();

    console.error(
      chalk.red(
        `The following frontmatter:\n${chalk.yellow(
          frontMatterString,
        )}\ncontains invalid values for field(s): ${invalidFields}.\n${errorMessages}\n`,
      ),
    );
    throw error;
  }

  return value;
}
