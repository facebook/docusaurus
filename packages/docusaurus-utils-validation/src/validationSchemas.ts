/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';

export const PluginIdSchema = Joi.string()
  .regex(/^[a-zA-Z_\-]+$/)
  // duplicate core constant, otherwise cyclic dependency is created :(
  .default('default');

const MarkdownPluginsSchema = Joi.array()
  .items(
    Joi.array()
      .ordered(Joi.function().required(), Joi.object().required()),
    Joi.function(),
    Joi.object(),
  )
  .default([]);

export const RemarkPluginsSchema = MarkdownPluginsSchema;
export const RehypePluginsSchema = MarkdownPluginsSchema;

export const AdmonitionsSchema = Joi.object().default({});

export const URISchema = Joi.alternatives(
  Joi.string().uri(),
  Joi.custom((val, helpers) => {
    try {
      const url = new URL(val);
      if (url) {
        return val;
      } else {
        return helpers.error('any.invalid');
      }
    } catch {
      return helpers.error('any.invalid');
    }
  }),
);
