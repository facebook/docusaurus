/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {load} from './index';
import {Props} from '@docusaurus/types';

// Helper methods to setup dummy/fake projects.
const loadSetup = async (name: string): Promise<Props> => {
  const fixtures = path.join(__dirname, '__tests__', '__fixtures__');
  const simpleSite = path.join(fixtures, 'simple-site');
  const customSite = path.join(fixtures, 'custom-site');

  switch (name) {
    case 'custom':
      return load(customSite);
    case 'simple':
    default:
      return load(simpleSite);
  }
};

export default loadSetup;
