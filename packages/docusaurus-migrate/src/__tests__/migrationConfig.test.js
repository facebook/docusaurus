/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import importFresh from 'import-fresh';
import {createConfigFile} from '../index';

describe('create config', () => {
  test('simple test', () => {
    const input = importFresh(`${__dirname}/__fixtures__/sourceSiteConfig.js`);

    const result = createConfigFile(input);

    const output = importFresh(
      `${__dirname}/__fixtures__/expectedSiteConfig.js`,
    );
    expect(result).toEqual(output);
  });
});
