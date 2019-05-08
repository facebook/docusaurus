/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@babel/polyfill';
import path from 'path';
import load from '../index';

// Helper methods to setup dummy/fake projects
const loadSetup = async name => {
  const fixtures = path.join(__dirname, '__tests__', '__fixtures__');
  const simpleSite = path.join(fixtures, 'simple-site');
  const customSite = path.join(fixtures, 'custom-site');

  switch (name) {
    case 'simple':
      return load(simpleSite);
    case 'custom':
      return load(customSite);
    default:
      return {};
  }
};

export default loadSetup;
