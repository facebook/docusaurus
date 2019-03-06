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
    expect(routesPaths).toMatchInlineSnapshot(`
Array [
  "/docs/hello",
  "/docs/endiliey/permalink",
  "/docs/foo/bar",
  "/docs/foo/baz",
  "/",
  "/hello/world",
]
`);
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths).toMatchInlineSnapshot(`
Array [
  "/docs/next/endiliey/permalink",
  "/docs/next/foo/bar",
  "/docs/next/foo/baz",
  "/docs/next/hello",
  "/docs/1.0.0/foo/bar",
  "/docs/1.0.0/foo/baz",
  "/docs/hello",
  "/docs/foo/bar",
  "/docs/foo/baz",
  "/docs/1.0.0/hello",
  "/",
  "/hello/world",
]
`);
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths).toMatchInlineSnapshot(`
Array [
  "/docs/en/next/hello",
  "/docs/en/next/foo/baz",
  "/docs/en/next/endiliey/permalink",
  "/docs/en/next/foo/bar",
  "/docs/ko/next/hello",
  "/docs/ko/next/foo/bar",
  "/docs/ko/next/foo/baz",
  "/docs/ko/1.0.0/hello",
  "/docs/ko/1.0.0/foo/bar",
  "/docs/ko/hello",
  "/docs/ko/1.0.0/foo/baz",
  "/docs/ko/foo/bar",
  "/docs/ko/foo/baz",
  "/docs/en/1.0.0/hello",
  "/docs/en/1.0.0/foo/baz",
  "/docs/en/1.0.0/foo/bar",
  "/docs/en/foo/baz",
  "/docs/en/foo/bar",
  "/docs/en/hello",
  "/",
  "/en/",
  "/ko/",
  "/hello/world",
  "/en/hello/world",
  "/ko/hello/world",
]
`);
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    const {routesPaths} = await loadRoutes(props);
    expect(routesPaths.length).toBeGreaterThan(0);
    expect(routesPaths).toMatchInlineSnapshot(`
Array [
  "/docs/en/hello",
  "/docs/en/endiliey/permalink",
  "/docs/en/foo/bar",
  "/docs/en/foo/baz",
  "/docs/ko/hello",
  "/docs/ko/foo/bar",
  "/docs/ko/foo/baz",
  "/",
  "/en/",
  "/ko/",
  "/hello/world",
  "/en/hello/world",
  "/ko/hello/world",
]
`);
  });
});
