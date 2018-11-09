/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import genRoutesConfig from '@lib/load/routes';
import loadSetup from '../loadSetup';

describe('genRoutesConfig', () => {
  test('simple website', async () => {
    const props = await loadSetup('simple');
    await genRoutesConfig(props);
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    await genRoutesConfig(props);
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    await genRoutesConfig(props);
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    await genRoutesConfig(props);
  });
});
