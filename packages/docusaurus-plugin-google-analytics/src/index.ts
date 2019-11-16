/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

export = function() {
  return {
    name: 'docusaurus-plugin-google-analytics',

    getClientModules() {
      return [path.resolve(__dirname, './analytics')];
    },
  };
};
