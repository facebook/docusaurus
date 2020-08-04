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
      // TODO, this allows [config,fn] too?
      .items(Joi.function().required(), Joi.object().required())
      .length(2),
    Joi.function(),
  )
  .default([]);

export const RemarkPluginsSchema = MarkdownPluginsSchema;
export const RehypePluginsSchema = MarkdownPluginsSchema;

export const AdmonitionsSchema = Joi.object().default({});
