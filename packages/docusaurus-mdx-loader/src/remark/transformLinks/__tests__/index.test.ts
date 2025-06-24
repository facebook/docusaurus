/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import * as path from 'path';
import vfile from 'to-vfile';
import plugin, {type PluginOptions} from '..';
import transformImage from '../../transformImage';

const siteDir = path.join(__dirname, `__fixtures__`);

const staticDirs = [
  path.join(siteDir, 'static'),
  path.join(siteDir, 'static2'),
];

const getProcessor = async (options?: Partial<PluginOptions>) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  return remark()
    .use(mdx)
    .use(transformImage, {
      siteDir,
      staticDirs,
      onBrokenMarkdownImages: 'throw',
    })
    .use(plugin, {
      staticDirs,
      siteDir,
      onBrokenMarkdownLinks: 'throw',
      ...options,
    });
};

const processFixture = async (
  name: string,
  options?: Partial<PluginOptions>,
) => {
  const processor = await getProcessor(options);
  const file = await vfile.read(path.join(siteDir, `${name}.md`));
  const result = await processor.process(file);
  return result.value.toString().trim();
};

const processContent = async (
  content: string,
  options?: Partial<PluginOptions>,
) => {
  const processor = await getProcessor(options);
  const result = await processor.process({
    value: content,
    path: path.posix.join(siteDir, 'docs', 'myFile.mdx'),
  });
  return result.value.toString().trim();
};

describe('transformLinks plugin', () => {
  it('transform md links to <a />', async () => {
    // TODO split fixture in many smaller test cases
    const result = await processFixture('asset');
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processContent(`pathname:///unchecked.pdf)`);
    expect(result).toMatchInlineSnapshot(`"pathname:///unchecked.pdf)"`);
  });

  it('accepts absolute file that does not exist', async () => {
    const result = await processContent(`[file](/dir/file.zip)`);
    expect(result).toMatchInlineSnapshot(`"[file](/dir/file.zip)"`);
  });

  it('accepts relative file that does not exist', async () => {
    const result = await processContent(`[file](dir/file.zip)`);
    expect(result).toMatchInlineSnapshot(`"[file](dir/file.zip)"`);
  });

  describe('onBrokenMarkdownLinks', () => {
    const fixtures = {
      urlEmpty: `[empty]()`,
      fileDoesNotExistSiteAlias: `[file](@site/file.zip)`,
    };

    describe('throws', () => {
      it('if url is empty', async () => {
        await expect(processContent(fixtures.urlEmpty)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown link with empty URL found in source file "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx" (1:1).
          To ignore this error, use the \`siteConfig.markdown.hooks.onBrokenMarkdownLinks\` option, or apply the \`pathname://\` protocol to the broken link URLs."
        `);
      });

      it('if file with site alias does not exist', async () => {
        await expect(processContent(fixtures.fileDoesNotExistSiteAlias)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown link with URL \`@site/file.zip\` in source file "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx" (1:1) couldn't be resolved.
          Make sure it references a local Markdown file that exists within the current plugin.
          To ignore this error, use the \`siteConfig.markdown.hooks.onBrokenMarkdownLinks\` option, or apply the \`pathname://\` protocol to the broken link URLs."
        `);
      });
    });

    describe('warns', () => {
      function processWarn(content: string) {
        return processContent(content, {onBrokenMarkdownLinks: 'warn'});
      }

      const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
      beforeEach(() => {
        warnMock.mockClear();
      });

      it('if url is empty', async () => {
        const result = await processWarn(fixtures.urlEmpty);
        expect(result).toMatchInlineSnapshot(`"[empty]()"`);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown link with empty URL found in source file "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx" (1:1).",
            ],
          ]
        `);
      });

      it('if file with site alias does not exist', async () => {
        const result = await processWarn(fixtures.fileDoesNotExistSiteAlias);
        expect(result).toMatchInlineSnapshot(`"[file](@site/file.zip)"`);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown link with URL \`@site/file.zip\` in source file "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx" (1:1) couldn't be resolved.
          Make sure it references a local Markdown file that exists within the current plugin.",
            ],
          ]
        `);
      });
    });

    describe('function form', () => {
      function processWarn(content: string) {
        return processContent(content, {
          onBrokenMarkdownLinks: (params) => {
            console.log('onBrokenMarkdownLinks called with', params);
            // We can alter the AST Node
            params.node.title = 'fixed link title';
            params.node.url = 'ignored, less important than returned value';
            // Or return a new URL
            return '/404';
          },
        });
      }

      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
      beforeEach(() => {
        logMock.mockClear();
      });

      it('if url is empty', async () => {
        const result = await processWarn(fixtures.urlEmpty);
        expect(result).toMatchInlineSnapshot(
          `"[empty](/404 "fixed link title")"`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownLinks called with",
              {
                "node": {
                  "children": [
                    {
                      "position": {
                        "end": {
                          "column": 7,
                          "line": 1,
                          "offset": 6,
                        },
                        "start": {
                          "column": 2,
                          "line": 1,
                          "offset": 1,
                        },
                      },
                      "type": "text",
                      "value": "empty",
                    },
                  ],
                  "position": {
                    "end": {
                      "column": 10,
                      "line": 1,
                      "offset": 9,
                    },
                    "start": {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "title": "fixed link title",
                  "type": "link",
                  "url": "/404",
                },
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "",
              },
            ],
          ]
        `);
      });

      it('if file with site alias does not exist', async () => {
        const result = await processWarn(fixtures.fileDoesNotExistSiteAlias);
        expect(result).toMatchInlineSnapshot(
          `"[file](/404 "fixed link title")"`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownLinks called with",
              {
                "node": {
                  "children": [
                    {
                      "position": {
                        "end": {
                          "column": 6,
                          "line": 1,
                          "offset": 5,
                        },
                        "start": {
                          "column": 2,
                          "line": 1,
                          "offset": 1,
                        },
                      },
                      "type": "text",
                      "value": "file",
                    },
                  ],
                  "position": {
                    "end": {
                      "column": 23,
                      "line": 1,
                      "offset": 22,
                    },
                    "start": {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "title": "fixed link title",
                  "type": "link",
                  "url": "/404",
                },
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "@site/file.zip",
              },
            ],
          ]
        `);
      });
    });
  });
});
