/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ensureUniquePluginInstanceIds} from '../../plugins/pluginIds';

import {InitPlugin} from '../../plugins/init';

function createTestPlugin(name: string, id?: string): InitPlugin {
  // @ts-expect-error: good enough for tests
  return {
    name,
    options: {id},
  };
}

describe('ensureUniquePluginInstanceIds', () => {
  test('accept single instance plugins', async () => {
    ensureUniquePluginInstanceIds([
      createTestPlugin('plugin-docs'),
      createTestPlugin('plugin-blog'),
      createTestPlugin('plugin-pages'),
    ]);
  });

  test('accept single instance plugins, all with sameId', async () => {
    ensureUniquePluginInstanceIds([
      createTestPlugin('plugin-docs', 'sameId'),
      createTestPlugin('plugin-blog', 'sameId'),
      createTestPlugin('plugin-pages', 'sameId'),
    ]);
  });

  test('accept multi instance plugins without id', async () => {
    ensureUniquePluginInstanceIds([
      createTestPlugin('plugin-docs', 'ios'),
      createTestPlugin('plugin-docs', 'android'),
      createTestPlugin('plugin-pages', 'pages'),
    ]);
  });

  test('reject multi instance plugins without id', async () => {
    expect(() =>
      ensureUniquePluginInstanceIds([
        createTestPlugin('plugin-docs'),
        createTestPlugin('plugin-docs'),
      ]),
    ).toThrowErrorMatchingSnapshot();
  });

  test('reject multi instance plugins with same id', async () => {
    expect(() =>
      ensureUniquePluginInstanceIds([
        createTestPlugin('plugin-docs', 'sameId'),
        createTestPlugin('plugin-docs', 'sameId'),
      ]),
    ).toThrowErrorMatchingSnapshot();
  });

  test('reject multi instance plugins without id', async () => {
    expect(() =>
      ensureUniquePluginInstanceIds([
        createTestPlugin('plugin-docs'),
        createTestPlugin('plugin-docs', 'ios'),
        createTestPlugin('plugin-docs'),
        createTestPlugin('plugin-pages'),
        createTestPlugin('plugin-pages', 'pages2'),
      ]),
    ).toThrowErrorMatchingSnapshot();
  });
});
