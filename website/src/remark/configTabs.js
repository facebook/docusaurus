/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');

/**
 * Turns a "```js config-tabs" code block into a "plugin options" and a "preset options" tab
 */
const plugin = () => {
  const transformer = (root) => {
    let tabsImported = false;
    let codeBlockImported = false;
    let transformed = false;
    visit(root, ['code', 'import'], (node, index, parent) => {
      if (node.type === 'import') {
        if (node.value.includes('@theme/Tabs')) {
          tabsImported = true;
        } else if (node.value.includes('@theme/CodeBlock')) {
          codeBlockImported = true;
        }
      } else if (node.meta?.includes('config-tabs')) {
        transformed = true;
        const {value} = node;
        const [presetMeta, pluginMeta] = value.split('\n');
        const {
          groups: {presetOptionName, presetOptionText},
        } = presetMeta.match(
          /\/\/(?<presetOptionText>.*?): (?<presetOptionName>[A-Za-z]+)/i,
        ) ?? {
          groups: {
            presetOptionName: '[translation failure]',
            presetOptionText: 'Preset Options',
          },
        };
        const {
          groups: {pluginName, pluginText},
        } = pluginMeta.match(
          /\/\/(?<pluginText>.*?): (?<pluginName>[A-Za-z@/-]+)/i,
        ) ?? {
          groups: {
            pluginName: '[translation failure]',
            pluginText: 'Plugin Options',
          },
        };
        // Replace leading "const config = " and trailing semi
        const config = value
          .replace(presetMeta, '')
          .replace(pluginMeta, '')
          .trim()
          .replace(/^.*?= /, '')
          .replace(/;$/, '')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$');
        const newNodes = [
          {
            type: 'jsx',
            value: `<Tabs>\n<TabItem value="${presetOptionText.trim()}">`,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value:
                  'If you use a preset, configure this plugin through the ',
              },
              {
                type: 'link',
                title: null,
                // TODO make this version-aware; maybe we need a useVersionedLink() hook
                url: '/docs/presets#docusauruspreset-classic',
                children: [
                  {
                    type: 'text',
                    value: 'preset options',
                  },
                ],
              },
              {
                type: 'text',
                value: ':',
              },
            ],
          },
          {
            type: 'jsx',
            value: `<CodeBlock className="language-js" title="docusaurus.config.js">
{\`module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // highlight-start
        ${presetOptionName.trim()}: ${config
              .split('\n')
              .map((line) => `        ${line}`)
              .join('\n')
              .trim()},
        // highlight-end
      },
    ],
  ],
};\`}
</CodeBlock>`,
          },
          {
            type: 'jsx',
            value: `</TabItem>\n<TabItem value="${pluginText.trim()}">`,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value:
                  'If you are using a standalone plugin, provide options directly to the plugin:',
              },
            ],
          },
          {
            type: 'jsx',
            value: `<CodeBlock className="language-js" title="docusaurus.config.js">
{\`module.exports = {
  plugins: [
    [
      '${pluginName.trim()}',
      // highlight-start
      ${config
        .split('\n')
        .map((line) => `      ${line}`)
        .join('\n')
        .trim()},
      // highlight-end
    ],
  ],
};\`}
</CodeBlock>`,
          },
          {
            type: 'jsx',
            value: '</TabItem>\n</Tabs>',
          },
        ];
        parent.children.splice(index, 1, ...newNodes);
      }
    });
    if (transformed) {
      if (!tabsImported) {
        root.children.unshift({
          type: 'import',
          value:
            "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';",
        });
      }
      if (!codeBlockImported) {
        root.children.unshift({
          type: 'import',
          value: "import CodeBlock from '@theme/CodeBlock';",
        });
      }
    }
  };
  return transformer;
};

module.exports = plugin;
