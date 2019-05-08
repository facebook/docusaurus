/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loadSetup from '../loadSetup';

describe('loadRoutes', () => {
  test('simple website', async () => {
    const {routesPaths} = await loadSetup('simple');
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths.sort()).toMatchInlineSnapshot(`
Array [
  "/",
  "/docs/endiliey/permalink",
  "/docs/foo/bar",
  "/docs/foo/baz",
  "/docs/hello",
  "/hello/world",
]
`);
  });

  test('custom website', async () => {
    const {routesPaths} = await loadSetup('custom');
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths.sort()).toMatchInlineSnapshot(`
Array [
  "/sakura/",
  "/sakura/bar/baz",
  "/sakura/docs/endiliey/permalink",
  "/sakura/docs/foo/bar",
  "/sakura/docs/foo/baz",
  "/sakura/docs/hello",
  "/sakura/foo",
  "/sakura/foo/",
]
`);
  });
});
