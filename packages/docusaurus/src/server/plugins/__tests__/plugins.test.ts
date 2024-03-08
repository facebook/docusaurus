/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {loadPlugins} from '../plugins';
import type {LoadContext, Plugin, PluginConfig} from '@docusaurus/types';

function test({
  plugins,
  themes,
}: {
  plugins: PluginConfig<any>[];
  themes: PluginConfig<any>[];
}) {
  const siteDir = path.join(__dirname, '__fixtures__/site-with-plugin');

  const context = fromPartial<LoadContext>({
    siteDir,
    siteConfigPath: path.join(siteDir, 'docusaurus.config.js'),
    generatedFilesDir: path.join(siteDir, '.docusaurus'),
    outDir: path.join(siteDir, 'build'),
    siteConfig: {
      baseUrl: '/',
      trailingSlash: true,
      themeConfig: {},
      presets: [],
      plugins,
      themes,
    },
  });

  return loadPlugins(context);
}

const SyntheticPluginNames = [
  'docusaurus-bootstrap-plugin',
  'docusaurus-mdx-fallback-plugin',
];

async function testPlugin<Content = unknown>(
  pluginConfig: PluginConfig<Content>,
) {
  const {plugins, routes, globalData} = await test({
    plugins: [pluginConfig],
    themes: [],
  });

  const nonSyntheticPlugins = plugins.filter(
    (p) => !SyntheticPluginNames.includes(p.name),
  );
  expect(nonSyntheticPlugins).toHaveLength(1);
  const plugin = nonSyntheticPlugins[0]!;
  expect(plugin).toBeDefined();

  return {plugin, routes, globalData};
}

describe('loadPlugins', () => {
  it('registers default synthetic plugins', async () => {
    const {plugins, routes, globalData} = await test({plugins: [], themes: []});
    // This adds some default synthetic plugins by default
    expect(plugins.map((p) => p.name)).toEqual(SyntheticPluginNames);
    expect(routes).toEqual([]);
    expect(globalData).toEqual({});
  });

  it('simplest plugin', async () => {
    const {plugin, routes, globalData} = await testPlugin(() => ({
      name: 'plugin-name',
    }));
    expect(plugin.name).toBe('plugin-name');
    expect(routes).toEqual([]);
    expect(globalData).toEqual({});
  });

  it('typical plugin', async () => {
    const {plugin, routes, globalData} = await testPlugin(() => ({
      name: 'plugin-name',
      loadContent: () => ({name: 'Toto', age: 42}),
      translateContent: ({content}) => ({
        ...content,
        name: `${content.name} (translated)`,
      }),
      contentLoaded({content, actions}) {
        actions.addRoute({
          path: '/foo',
          component: 'Comp',
          modules: {someModule: 'someModulePath'},
          context: {someContext: 'someContextPath'},
        });
        actions.setGlobalData({
          globalName: content.name,
          globalAge: content.age,
        });
      },
    }));

    expect(plugin.content).toMatchInlineSnapshot(`
      {
        "age": 42,
        "name": "Toto (translated)",
      }
    `);
    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "component": "Comp",
          "context": {
            "data": {
              "someContext": "someContextPath",
            },
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/default/plugin-route-context-module-100.json",
          },
          "modules": {
            "someModule": "someModulePath",
          },
          "path": "/foo/",
        },
      ]
    `);
    expect(globalData).toMatchInlineSnapshot(`
      {
        "plugin-name": {
          "default": {
            "globalAge": 42,
            "globalName": "Toto (translated)",
          },
        },
      }
    `);
  });

  it('plugin with options', async () => {
    const pluginOptions = {id: 'plugin-id', someOption: 42};

    const {plugin, routes, globalData} = await testPlugin([
      (_context, options) => ({
        name: 'plugin-name',
        loadContent: () => ({options, name: 'Toto'}),
        contentLoaded({content, actions}) {
          actions.addRoute({
            path: '/foo',
            component: 'Comp',
          });
          actions.setGlobalData({
            // @ts-expect-error: TODO fix plugin/option type inference issue
            globalName: content.name,
            // @ts-expect-error: TODO fix plugin/option type inference issue
            globalSomeOption: content.options.someOption,
          });
        },
      }),
      pluginOptions,
    ]);

    expect(plugin.name).toBe('plugin-name');
    expect(plugin.options).toEqual(pluginOptions);
    expect(plugin.content).toMatchInlineSnapshot(`
      {
        "name": "Toto",
        "options": {
          "id": "plugin-id",
          "someOption": 42,
        },
      }
    `);

    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "component": "Comp",
          "context": {
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/plugin-id/plugin-route-context-module-100.json",
          },
          "path": "/foo/",
        },
      ]
    `);
    expect(globalData).toMatchInlineSnapshot(`
      {
        "plugin-name": {
          "plugin-id": {
            "globalName": "Toto",
            "globalSomeOption": 42,
          },
        },
      }
    `);
  });

  it('plugin with This binding', async () => {
    const {plugin, routes, globalData} = await testPlugin(
      () =>
        ({
          name: 'plugin-name',
          someAttribute: 'val',
          async loadContent() {
            return this.someAttribute;
          },
          async contentLoaded({content, actions}) {
            actions.setGlobalData({
              content,
              someAttributeGlobal: this.someAttribute,
            });
          },
        } as Plugin & ThisType<{someAttribute: string}>),
    );

    expect(plugin.content).toMatchInlineSnapshot(`"val"`);
    expect(routes).toMatchInlineSnapshot(`[]`);
    expect(globalData).toMatchInlineSnapshot(`
      {
        "plugin-name": {
          "default": {
            "content": "val",
            "someAttributeGlobal": "val",
          },
        },
      }
    `);
  });
});
