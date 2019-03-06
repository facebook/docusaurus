/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loadRoutes from '@lib/load/routes';
import loadSetup from '../loadSetup';

describe('loadRoutes', () => {
  test('simple website', async () => {
    const props = await loadSetup('simple');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
  });
});
