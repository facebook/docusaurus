/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as yup from 'yup';

export const PluginOptionSchema = yup
  .object()
  .shape({
    path: yup.string().default('src/pages'), // Path to data on filesystem, relative to site dir.
    routeBasePath: yup.string().default(''), // URL Route.
    include: yup.array().of(yup.string()).default(['**/*.{js,jsx,ts,tsx}']), // Extensions to include.
  })
  .defined();
