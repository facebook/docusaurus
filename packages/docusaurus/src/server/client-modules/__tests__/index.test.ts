/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loadClientModules from '../index';

import pluginEmpty from './__fixtures__/plugin-empty';
import pluginFooBar from './__fixtures__/plugin-foo-bar';
import pluginHelloWorld from './__fixtures__/plugin-hello-world';

describe('loadClientModules', () => {
  it('empty', () => {
    const clientModules = loadClientModules([pluginEmpty()]);
    expect(clientModules).toMatchInlineSnapshot(`[]`);
  });

  it('non-empty', () => {
    const clientModules = loadClientModules([pluginFooBar()]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/bar",
      ]
    `);
  });

  it('multiple non-empty', () => {
    const clientModules = loadClientModules([
      pluginFooBar(),
      pluginHelloWorld(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/bar",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/world",
      ]
    `);
  });

  it('multiple non-empty different order', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginFooBar(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/bar",
      ]
    `);
  });

  it('empty and non-empty', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginEmpty(),
      pluginFooBar(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/bar",
      ]
    `);
  });

  it('empty and non-empty different order', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginFooBar(),
      pluginEmpty(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/client-modules/__tests__/__fixtures__/bar",
      ]
    `);
  });
});
