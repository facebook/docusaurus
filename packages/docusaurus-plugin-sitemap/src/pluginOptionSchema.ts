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

// A yup number without type coercion
class StrictNumber extends yup.number {
  constructor() {
    super();
    // @ts-ignore
    this.transforms = [];
  }
}

export const PluginOptionSchema = yup.object().shape({
  cacheTime: new StrictNumber().default(600 * 1000), // 600 sec - cache purge period.
  changefreq: new StrictString().default('weekly'),
  priority: new StrictNumber().default(0.5),
});
