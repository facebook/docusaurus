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

  test('versioned website', async () => {
    const {routesPaths} = await loadSetup('versioned');
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths.sort()).toMatchInlineSnapshot(`
Array [
  "/",
  "/docs/1.0.0/foo/bar",
  "/docs/1.0.0/foo/baz",
  "/docs/1.0.0/hello",
  "/docs/foo/bar",
  "/docs/foo/baz",
  "/docs/hello",
  "/docs/next/endiliey/permalink",
  "/docs/next/foo/bar",
  "/docs/next/foo/baz",
  "/docs/next/hello",
  "/hello/world",
]
`);
  });

  test('versioned & translated website', async () => {
    const {routesPaths} = await loadSetup('transversioned');
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths.sort()).toMatchInlineSnapshot(`
Array [
  "/",
  "/docs/en/1.0.0/foo/bar",
  "/docs/en/1.0.0/foo/baz",
  "/docs/en/1.0.0/hello",
  "/docs/en/foo/bar",
  "/docs/en/foo/baz",
  "/docs/en/hello",
  "/docs/en/next/endiliey/permalink",
  "/docs/en/next/foo/bar",
  "/docs/en/next/foo/baz",
  "/docs/en/next/hello",
  "/docs/ko/1.0.0/foo/bar",
  "/docs/ko/1.0.0/foo/baz",
  "/docs/ko/1.0.0/hello",
  "/docs/ko/foo/bar",
  "/docs/ko/foo/baz",
  "/docs/ko/hello",
  "/docs/ko/next/foo/bar",
  "/docs/ko/next/foo/baz",
  "/docs/ko/next/hello",
  "/en/",
  "/en/hello/world",
  "/hello/world",
  "/ko/",
  "/ko/hello/world",
]
`);
  });

  test('translated website', async () => {
    const {routesPaths} = await loadSetup('translated');
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths.sort()).toMatchInlineSnapshot(`
Array [
  "/",
  "/docs/en/endiliey/permalink",
  "/docs/en/foo/bar",
  "/docs/en/foo/baz",
  "/docs/en/hello",
  "/docs/ko/foo/bar",
  "/docs/ko/foo/baz",
  "/docs/ko/hello",
  "/en/",
  "/en/hello/world",
  "/hello/world",
  "/ko/",
  "/ko/hello/world",
]
`);
  });
});
