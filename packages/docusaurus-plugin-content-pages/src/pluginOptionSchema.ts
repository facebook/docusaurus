/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as yup from 'yup';

// A yup string without type coercion
class StrictString extends yup.string {
  constructor() {
    super();
    // @ts-ignore
    this.transforms = []; // remove coercion, see https://github.com/jquense/yup/issues/934
  }
}

export const PluginOptionSchema = yup
  .object()
  .shape({
    path: new StrictString().default('src/pages'), // Path to data on filesystem, relative to site dir.
    routeBasePath: new StrictString().default(''), // URL Route.
    include: yup
      .array()
      .of(new StrictString())
      .default(['**/*.{js,jsx,ts,tsx}']), // Extensions to include.
  })
  .defined();
