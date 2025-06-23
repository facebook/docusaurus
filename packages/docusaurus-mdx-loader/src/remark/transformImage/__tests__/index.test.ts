/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import * as path from 'path';
import vfile from 'to-vfile';
import plugin, {type PluginOptions} from '../index';

const siteDir = path.join(__dirname, '__fixtures__');

const staticDirs = [
  path.join(__dirname, '__fixtures__/static'),
  path.join(__dirname, '__fixtures__/static2'),
];

const getProcessor = async (options?: Partial<PluginOptions>) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  return remark()
    .use(mdx)
    .use(plugin, {
      siteDir,
      staticDirs,
      onBrokenMarkdownImages: 'throw',
      ...options,
    });
};

const processFixture = async (
  name: string,
  options?: Partial<PluginOptions>,
) => {
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const file = await vfile.read(filePath);
  const processor = await getProcessor(options);
  const result = await processor.process(file);
  return result.value;
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
  return result.value.toString();
};

describe('transformImage plugin', () => {
  it('transform md images to <img />', async () => {
    // TODO split that large fixture into many smaller test cases?
    const result = await processFixture('img');
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processContent(
      `![img](pathname:///img/unchecked.png)`,
    );
    expect(result).toMatchSnapshot();
  });

  it('does not choke on invalid image', async () => {
    const errorMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await processContent(`![invalid image](/invalid.png)`);
    expect(result).toMatchSnapshot();
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  describe('onBrokenMarkdownImages', () => {
    const fixtures = {
      doesNotExistAbsolute: `![img](/img/doesNotExist.png)`,
      doesNotExistRelative: `![img](./doesNotExist.png)`,
      doesNotExistSiteAlias: `![img](@site/doesNotExist.png)`,
      urlEmpty: `![img]()`,
    };

    describe('throws', () => {
      it('if image absolute path does not exist', async () => {
        await expect(processContent(fixtures.doesNotExistAbsolute)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown image with URL \`/img/doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs."
        `);
      });

      it('if image relative path does not exist', async () => {
        await expect(processContent(fixtures.doesNotExistRelative)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown image with URL \`./doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs."
        `);
      });

      it('if image @site path does not exist', async () => {
        await expect(processContent(fixtures.doesNotExistSiteAlias)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown image with URL \`@site/doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs."
        `);
      });

      it('if image url empty', async () => {
        await expect(processContent(fixtures.urlEmpty)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "Markdown image with empty URL found in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx".
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs."
        `);
      });
    });

    describe('warns', () => {
      function processWarn(content: string) {
        return processContent(content, {onBrokenMarkdownImages: 'warn'});
      }

      const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
      beforeEach(() => {
        warnMock.mockClear();
      });

      it('if image absolute path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistAbsolute);
        expect(result).toMatchInlineSnapshot(`
          "![img](/img/doesNotExist.png)
          "
        `);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown image with URL \`/img/doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs.",
            ],
          ]
        `);
      });

      it('if image relative path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistRelative);
        expect(result).toMatchInlineSnapshot(`
          "![img](./doesNotExist.png)
          "
        `);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown image with URL \`./doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs.",
            ],
          ]
        `);
      });

      it('if image @site path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistSiteAlias);
        expect(result).toMatchInlineSnapshot(`
          "![img](@site/doesNotExist.png)
          "
        `);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown image with URL \`@site/doesNotExist.png\` in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" couldn't be resolved to an existing local image file.
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs.",
            ],
          ]
        `);
      });

      it('if image url empty', async () => {
        const result = await processWarn(fixtures.urlEmpty);
        expect(result).toMatchInlineSnapshot(`
          "![img]()
          "
        `);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(warnMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "[WARNING] Markdown image with empty URL found in source file "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx".
          To ignore this error, use the \`onBrokenMarkdownImages\` site config option, or apply the \`pathname://\` protocol to the broken image URLs.",
            ],
          ]
        `);
      });
    });

    describe('function form', () => {
      function processWarn(content: string) {
        return processContent(content, {
          onBrokenMarkdownImages: ({sourceFilePath, url}) => {
            console.log('onBrokenMarkdownImages called for ', {
              sourceFilePath,
              url,
            });
            return '/404.png';
          },
        });
      }

      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
      beforeEach(() => {
        logMock.mockClear();
      });

      it('if image absolute path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistAbsolute);
        expect(result).toMatchInlineSnapshot(`
          "![img](/404.png)
          "
        `);
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownImages called for ",
              {
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "/img/doesNotExist.png",
              },
            ],
          ]
        `);
      });

      it('if image relative path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistRelative);
        expect(result).toMatchInlineSnapshot(`
          "![img](/404.png)
          "
        `);
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownImages called for ",
              {
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "./doesNotExist.png",
              },
            ],
          ]
        `);
      });

      it('if image @site path does not exist', async () => {
        const result = await processWarn(fixtures.doesNotExistSiteAlias);
        expect(result).toMatchInlineSnapshot(`
          "![img](/404.png)
          "
        `);
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownImages called for ",
              {
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "@site/doesNotExist.png",
              },
            ],
          ]
        `);
      });

      it('if image url empty', async () => {
        const result = await processWarn(fixtures.urlEmpty);
        expect(result).toMatchInlineSnapshot(`
          "![img](/404.png)
          "
        `);
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "onBrokenMarkdownImages called for ",
              {
                "sourceFilePath": "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx",
                "url": "",
              },
            ],
          ]
        `);
      });
    });
  });
});
