/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default('src/pages'), // Path to data on filesystem, relative to site dir.
  routeBasePath: Joi.string().default(''), // URL Route.
  include: Joi.array().items(Joi.string()).default(['**/*.{js,jsx,ts,tsx}']), // Extensions to include.
});
