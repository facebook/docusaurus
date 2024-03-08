/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {loadPlugins, mergeGlobalData} from '../plugins';
import type {
  GlobalData,
  LoadContext,
  Plugin,
  PluginConfig,
} from '@docusaurus/types';

function testLoad({
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
  const {plugins, routes, globalData} = await testLoad({
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

describe('mergeGlobalData', () => {
  it('no global data', () => {
    expect(mergeGlobalData()).toEqual({});
  });

  it('1 global data', () => {
    const globalData: GlobalData = {
      plugin: {
        default: {someData: 'val'},
      },
    };
    expect(mergeGlobalData(globalData)).toEqual(globalData);
  });

  it('1 global data - primitive value', () => {
    // For retro-compatibility we allow primitive values to be kept as is
    // Not sure anyone is using primitive global data though...
    const globalData: GlobalData = {
      plugin: {
        default: 42,
      },
    };
    expect(mergeGlobalData(globalData)).toEqual(globalData);
  });

  it('3 distinct plugins global data', () => {
    const globalData1: GlobalData = {
      plugin1: {
        default: {someData1: 'val1'},
      },
    };
    const globalData2: GlobalData = {
      plugin2: {
        default: {someData2: 'val2'},
      },
    };
    const globalData3: GlobalData = {
      plugin3: {
        default: {someData3: 'val3'},
      },
    };

    expect(mergeGlobalData(globalData1, globalData2, globalData3)).toEqual({
      plugin1: {
        default: {someData1: 'val1'},
      },
      plugin2: {
        default: {someData2: 'val2'},
      },
      plugin3: {
        default: {someData3: 'val3'},
      },
    });
  });

  it('3 plugin instances of same plugin', () => {
    const globalData1: GlobalData = {
      plugin: {
        id1: {someData1: 'val1'},
      },
    };
    const globalData2: GlobalData = {
      plugin: {
        id2: {someData2: 'val2'},
      },
    };
    const globalData3: GlobalData = {
      plugin: {
        id3: {someData3: 'val3'},
      },
    };

    expect(mergeGlobalData(globalData1, globalData2, globalData3)).toEqual({
      plugin: {
        id1: {someData1: 'val1'},
        id2: {someData2: 'val2'},
        id3: {someData3: 'val3'},
      },
    });
  });

  it('3 times the same plugin', () => {
    const globalData1: GlobalData = {
      plugin: {
        id: {someData1: 'val1', shared: 'shared1'},
      },
    };
    const globalData2: GlobalData = {
      plugin: {
        id: {someData2: 'val2', shared: 'shared2'},
      },
    };
    const globalData3: GlobalData = {
      plugin: {
        id: {someData3: 'val3', shared: 'shared3'},
      },
    };

    expect(mergeGlobalData(globalData1, globalData2, globalData3)).toEqual({
      plugin: {
        id: {
          someData1: 'val1',
          someData2: 'val2',
          someData3: 'val3',
          shared: 'shared3',
        },
      },
    });
  });

  it('3 times same plugin - including primitive values', () => {
    // Very unlikely to happen, but we can't merge primitive values together
    // Since we use Object.assign(), the primitive values are simply ignored
    const globalData1: GlobalData = {
      plugin: {
        default: 42,
      },
    };
    const globalData2: GlobalData = {
      plugin: {
        default: {hey: 'val'},
      },
    };
    const globalData3: GlobalData = {
      plugin: {
        default: 84,
      },
    };
    expect(mergeGlobalData(globalData1, globalData2, globalData3)).toEqual({
      plugin: {
        default: {hey: 'val'},
      },
    });
  });

  it('real world case', () => {
    const globalData1: GlobalData = {
      plugin1: {
        id1: {someData1: 'val1', shared: 'globalData1'},
      },
    };
    const globalData2: GlobalData = {
      plugin1: {
        id1: {someData2: 'val2', shared: 'globalData2'},
      },
    };

    const globalData3: GlobalData = {
      plugin1: {
        id2: {someData3: 'val3', shared: 'globalData3'},
      },
    };

    const globalData4: GlobalData = {
      plugin2: {
        id1: {someData1: 'val1', shared: 'globalData4'},
      },
    };
    const globalData5: GlobalData = {
      plugin2: {
        id2: {someData1: 'val1', shared: 'globalData5'},
      },
    };

    const globalData6: GlobalData = {
      plugin3: {
        id1: {someData1: 'val1', shared: 'globalData6'},
      },
    };

    expect(
      mergeGlobalData(
        globalData1,
        globalData2,
        globalData3,
        globalData4,
        globalData5,
        globalData6,
      ),
    ).toEqual({
      plugin1: {
        id1: {someData1: 'val1', someData2: 'val2', shared: 'globalData2'},
        id2: {someData3: 'val3', shared: 'globalData3'},
      },
      plugin2: {
        id1: {someData1: 'val1', shared: 'globalData4'},
        id2: {someData1: 'val1', shared: 'globalData5'},
      },
      plugin3: {
        id1: {someData1: 'val1', shared: 'globalData6'},
      },
    });
  });
});

describe('loadPlugins', () => {
  it('registers default synthetic plugins', async () => {
    const {plugins, routes, globalData} = await testLoad({
      plugins: [],
      themes: [],
    });
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

  it('plugin with contentLoaded + allContentLoaded lifecycle', async () => {
    const {routes, globalData} = await testPlugin(() => ({
      name: 'plugin-name',
      contentLoaded({actions}) {
        actions.addRoute({
          path: '/contentLoadedRouteParent',
          component: 'Comp',
          routes: [
            {path: '/contentLoadedRouteParent/child', component: 'Comp'},
          ],
        });
        actions.addRoute({
          path: '/contentLoadedRouteSingle',
          component: 'Comp',
        });
        actions.setGlobalData({
          globalContentLoaded: 'val1',
          globalOverridden: 'initial-value',
        });
      },
      allContentLoaded({actions}) {
        actions.addRoute({
          path: '/allContentLoadedRouteParent',
          component: 'Comp',
          routes: [
            {path: '/allContentLoadedRouteParent/child', component: 'Comp'},
          ],
        });
        actions.addRoute({
          path: '/allContentLoadedRouteSingle',
          component: 'Comp',
        });
        actions.setGlobalData({
          globalAllContentLoaded: 'val2',
          globalOverridden: 'override-value',
        });
      },
    }));

    // Routes of both lifecycles are appropriately sorted
    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "component": "Comp",
          "context": {
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/default/plugin-route-context-module-100.json",
          },
          "path": "/allContentLoadedRouteSingle/",
        },
        {
          "component": "Comp",
          "context": {
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/default/plugin-route-context-module-100.json",
          },
          "path": "/contentLoadedRouteSingle/",
        },
        {
          "component": "Comp",
          "context": {
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/default/plugin-route-context-module-100.json",
          },
          "path": "/allContentLoadedRouteParent/",
          "routes": [
            {
              "component": "Comp",
              "path": "/allContentLoadedRouteParent/child/",
            },
          ],
        },
        {
          "component": "Comp",
          "context": {
            "plugin": "<PROJECT_ROOT>/packages/docusaurus/src/server/plugins/__tests__/__fixtures__/site-with-plugin/.docusaurus/plugin-name/default/plugin-route-context-module-100.json",
          },
          "path": "/contentLoadedRouteParent/",
          "routes": [
            {
              "component": "Comp",
              "path": "/contentLoadedRouteParent/child/",
            },
          ],
        },
      ]
    `);

    expect(globalData).toMatchInlineSnapshot(`
      {
        "plugin-name": {
          "default": {
            "globalAllContentLoaded": "val2",
            "globalContentLoaded": "val1",
            "globalOverridden": "override-value",
          },
        },
      }
    `);
  });
});
