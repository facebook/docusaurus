/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type Joi from './Joi';
import logger from '@docusaurus/logger';
import {PluginIdSchema} from './validationSchemas';

export function printWarning(warning?: Joi.ValidationError): void {
  if (warning) {
    const warningMessages = warning.details
      .map(({message}) => message)
      .join('\n');
    logger.warn(warningMessages);
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
    throw error;
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
    throw error;
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

    logger.error`The following front matter:
${logger.yellow(frontMatterString)}
contains invalid values for field(s): ${logger.yellow(invalidFields)}.
${errorDetails.map(({message}) => message)}
`;
    throw error;
  }

  return value;
}
