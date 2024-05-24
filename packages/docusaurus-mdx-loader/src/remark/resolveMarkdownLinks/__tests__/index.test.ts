/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import plugin from '..';
import type {PluginOptions} from '../index';

async function process(
  content: string,
  pluginOptions?: Partial<PluginOptions>,
) {
  const {remark} = await import('remark');

  const options: PluginOptions = {
    resolveMarkdownLink: ({linkPathname}) => `RESOLVED---${linkPathname}`,
    ...pluginOptions,
  };

  const result = await remark().use(plugin, options).process(content);

  return result.value;
}

describe('resolveMarkdownLinks remark plugin', () => {
  it('resolves Markdown and MDX links', async () => {
    /* language=markdown */
    const content = `[link1](link1.mdx)

    [link2](../myLink2.md) [link3](myLink3.md)

    [link4](../myLink4.mdx?qs#hash) [link5](./../my/great/link5.md?#)

    [link6](../myLink6.mdx?qs#hash)

    [link7](<link with spaces 7.md?qs#hash>)

    <b>[link8](/link8.md)</b>

    [**link** \`9\`](/link9.md)
    `;

    const result = await process(content);

    expect(result).toMatchInlineSnapshot(`
      "[link1](RESOLVED---link1.mdx)

      \`\`\`
      [link2](../myLink2.md) [link3](myLink3.md)

      [link4](../myLink4.mdx?qs#hash) [link5](./../my/great/link5.md?#)

      [link6](../myLink6.mdx?qs#hash)

      [link7](<link with spaces 7.md?qs#hash>)

      <b>[link8](/link8.md)</b>

      [**link** \`9\`](/link9.md)
      \`\`\`
      "
    `);
  });

  it('skips non-Markdown links', async () => {
    /* language=markdown */
    const content = `[link1](./myLink1.m)

[link2](../myLink2mdx)

[link3](https://github.com/facebook/docusaurus/blob/main/README.md)

[link4](ftp:///README.mdx)

[link5](../link5.js)

[link6](../link6.jsx)

[link7](../link7.tsx)

<!--
[link8](link8.mdx)
-->

\`\`\`md
[link9](link9.md)
\`\`\`
`;

    const result = await process(content);

    expect(result).toMatchInlineSnapshot(`
      "[link1](./myLink1.m)

      [link2](../myLink2mdx)

      [link3](https://github.com/facebook/docusaurus/blob/main/README.md)

      [link4](ftp:///README.mdx)

      [link5](../link5.js)

      [link6](../link6.jsx)

      [link7](../link7.tsx)

      <!--
      [link8](link8.mdx)
      -->

      \`\`\`md
      [link9](link9.md)
      \`\`\`
      "
    `);
  });

  it('keeps regular Markdown unmodified', async () => {
    /* language=markdown */
    const content = `# Title

Simple link

\`\`\`js
this is a code block
\`\`\`
`;

    const result = await process(content);

    expect(result).toEqual(content);
  });
});
