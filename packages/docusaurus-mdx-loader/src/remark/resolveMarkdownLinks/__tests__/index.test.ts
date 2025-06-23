/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import * as path from 'path';
import plugin from '..';
import type {PluginOptions} from '../index';

const siteDir = __dirname;

const DefaultTestOptions: PluginOptions = {
  resolveMarkdownLink: ({linkPathname}) => `/RESOLVED---${linkPathname}`,
  onBrokenMarkdownLinks: 'throw',
};

async function process(content: string, optionsInput?: Partial<PluginOptions>) {
  const options = {
    ...DefaultTestOptions,
    ...optionsInput,
  };

  const {remark} = await import('remark');

  const result = await remark()
    .use(plugin, options)
    .process({
      value: content,
      path: path.posix.join(siteDir, 'docs', 'myFile.mdx'),
    });

  return result.value;
}

describe('resolveMarkdownLinks remark plugin', () => {
  it('accepts non-md link', async () => {
    /* language=markdown */
    const content = `[link1](link1)`;
    const result = await process(content);
    expect(result).toMatchInlineSnapshot(`
        "[link1](link1)
        "
      `);
  });

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
      "[link1](/RESOLVED---link1.mdx)

      [link2](/RESOLVED---../myLink2.md) [link3](/RESOLVED---myLink3.md)

      [link4](/RESOLVED---../myLink4.mdx?qs#hash) [link5](/RESOLVED---./../my/great/link5.md?#)

      [link6](/RESOLVED---../myLink6.mdx?qs#hash)

      [link7](</RESOLVED---link with spaces 7.md?qs#hash>)

      <b>[link8](/RESOLVED---/link8.md)</b>

      [**link** \`9\`](/RESOLVED---/link9.md)
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

  it('supports link references', async () => {
    /* language=markdown */
    const content = `Testing some link refs:

* [link-ref1]
* [link-ref2]
* [link-ref3]

[link-ref1]: target.mdx
[link-ref2]: ./target.mdx
[link-ref3]: ../links/target.mdx?qs#target-heading
    `;

    const result = await process(content);

    expect(result).toMatchInlineSnapshot(`
      "Testing some link refs:

      * [link-ref1]
      * [link-ref2]
      * [link-ref3]

      [link-ref1]: /RESOLVED---target.mdx

      [link-ref2]: /RESOLVED---./target.mdx

      [link-ref3]: /RESOLVED---../links/target.mdx?qs#target-heading
      "
    `);
  });

  describe('onBrokenMarkdownLinks', () => {
    const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    beforeEach(() => {
      warnMock.mockClear();
    });

    async function processResolutionErrors(
      content: string,
      onBrokenMarkdownLinks: PluginOptions['onBrokenMarkdownLinks'] = 'throw',
    ) {
      return process(content, {
        resolveMarkdownLink: () => null,
        onBrokenMarkdownLinks,
      });
    }

    describe('throws', () => {
      it('for unresolvable mdx link', async () => {
        /* language=markdown */
        const content = `[link1](link1.mdx)`;

        await expect(() => processResolutionErrors(content)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
        "Markdown link with URL $\`link1.mdx\`) in source file "packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx" couldn't be resolved.
        Make sure it references a local Markdown file that exists within the current plugin.
        To ignore this error, use the \`siteConfig.markdown.hooks.onBrokenMarkdownLinks\` option, or apply the \`pathname://\` protocol to the broken link URLs."
      `);
      });

      it('for unresolvable md link', async () => {
        /* language=markdown */
        const content = `[link1](link1.md)`;

        await expect(() => processResolutionErrors(content)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
        "Markdown link with URL $\`link1.md\`) in source file "packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx" couldn't be resolved.
        Make sure it references a local Markdown file that exists within the current plugin.
        To ignore this error, use the \`siteConfig.markdown.hooks.onBrokenMarkdownLinks\` option, or apply the \`pathname://\` protocol to the broken link URLs."
      `);
      });
    });

    describe('warns', () => {
      it('for unresolvable md and mdx link', async () => {
        /* language=markdown */
        const content = `
[link1](link1.mdx)

[link2](link2)

[link3](dir/link3.md)

[link 4](/link/4)
      `;

        const result = await processResolutionErrors(content, 'warn');

        expect(result).toMatchInlineSnapshot(`
        "[link1](link1.mdx)

        [link2](link2)

        [link3](dir/link3.md)

        [link 4](/link/4)
        "
      `);

        expect(warnMock).toHaveBeenCalledTimes(2);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "[WARNING] Markdown link with URL $\`link1.mdx\`) in source file "packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx" couldn't be resolved.
        Make sure it references a local Markdown file that exists within the current plugin.",
          ],
          [
            "[WARNING] Markdown link with URL $\`dir/link3.md\`) in source file "packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx" couldn't be resolved.
        Make sure it references a local Markdown file that exists within the current plugin.",
          ],
        ]
      `);
      });

      it('for unresolvable md and mdx link - with recovery', async () => {
        /* language=markdown */
        const content = `
[link1](link1.mdx)

[link2](link2)

[link3](dir/link3.md?query#hash)

[link 4](/link/4)
      `;

        const result = await processResolutionErrors(
          content,
          ({sourceFilePath, url}) => {
            console.warn(`recovering broken markdown link ${url}`);
            return `/recovered/___${sourceFilePath}___/___${url}`;
          },
        );

        expect(result).toMatchInlineSnapshot(`
        "[link1](/recovered/___packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx___/___link1.mdx)

        [link2](link2)

        [link3](/recovered/___packages/docusaurus-mdx-loader/src/remark/resolveMarkdownLinks/__tests__/docs/myFile.mdx___/___dir/link3.md?query#hash)

        [link 4](/link/4)
        "
      `);

        expect(warnMock).toHaveBeenCalledTimes(2);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "recovering broken markdown link link1.mdx",
          ],
          [
            "recovering broken markdown link dir/link3.md?query#hash",
          ],
        ]
      `);
      });
    });
  });
});
