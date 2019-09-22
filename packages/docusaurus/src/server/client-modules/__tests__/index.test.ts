/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadClientModules} from '../index';

const pluginEmpty = require('./__fixtures__/plugin-empty');
const pluginFooBar = require('./__fixtures__/plugin-foo-bar');
const pluginHelloWorld = require('./__fixtures__/plugin-hello-world');

describe('loadClientModules', () => {
  test('empty', () => {
    const clientModules = loadClientModules([pluginEmpty()]);
    expect(clientModules).toMatchInlineSnapshot(`Array []`);
  });

  test('non-empty', () => {
    const clientModules = loadClientModules([pluginFooBar()]);
    expect(clientModules).toMatchInlineSnapshot(`
      Array [
        "foo",
        "bar",
      ]
    `);
  });

  test('multiple non-empty', () => {
    const clientModules = loadClientModules([
      pluginFooBar(),
      pluginHelloWorld(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      Array [
        "foo",
        "bar",
        "hello",
        "world",
      ]
    `);
  });

  test('multiple non-empty different order', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginFooBar(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      Array [
        "hello",
        "world",
        "foo",
        "bar",
      ]
    `);
  });

  test('empty and non-empty', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginEmpty(),
      pluginFooBar(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      Array [
        "hello",
        "world",
        "foo",
        "bar",
      ]
    `);
  });

  test('empty and non-empty different order', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld(),
      pluginFooBar(),
      pluginEmpty(),
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      Array [
        "hello",
        "world",
        "foo",
        "bar",
      ]
    `);
  });
});
