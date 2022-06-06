/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';

/**
 * Turns a "```js config-tabs" code block into a "plugin options" and a "preset
 * options" tab
 */
export default function plugin() {
  /** @type {import("unified").Transformer} */
  const transformer = (root) => {
    visit(root, 'code', (node, index, parent) => {
      if (!node.meta?.includes('config-tabs')) {
        return;
      }
      const {value} = node;
      const [presetMeta, pluginMeta] = value.split('\n');
      const {
        groups: {presetOptionName},
      } = presetMeta.match(/\/\/.*?: (?<presetOptionName>[A-Z]+)/i) ?? {
        groups: {presetOptionName: '[translation failure]'},
      };
      const {
        groups: {pluginName},
      } = pluginMeta.match(/\/\/.*?: (?<pluginName>[A-Z@/-]+)/i) ?? {
        groups: {pluginName: '[translation failure]'},
      };
      // Replace pragma comments
      const config = value
        .replace(presetMeta, '')
        .replace(pluginMeta, '')
        .trim()
        .replace(/^.*?= /, '')
        .replace(/;$/, '')
        // eslint-disable-next-line prefer-named-capture-group
        .replace(/([`$\\])/g, '\\$1');

      parent.children.splice(
        index,
        1,
        {
          type: 'import',
          value: `import ConfigTabs from "@site/src/components/ConfigTabs";`,
        },
        {
          type: 'jsx',
          value: `<ConfigTabs
            pluginName="${pluginName.trim()}"
            presetOptionName="${presetOptionName.trim()}"
            code={\`${config}\`}
          />`,
        },
      );
    });
  };
  return transformer;
}
