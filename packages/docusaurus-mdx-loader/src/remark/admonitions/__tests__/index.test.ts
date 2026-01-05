/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import vfile from 'to-vfile';
import preprocessor from '../../../preprocessor';
import plugin, {DefaultAdmonitionOptions} from '../index';
import type {AdmonitionOptions} from '../index';

const processFixture = async (
  name: string,
  options?: Partial<AdmonitionOptions>,
) => {
  const {remark} = await import('remark');
  const {default: directives} = await import('remark-directive');

  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  const fileContentPreprocessed = preprocessor({
    fileContent: file.toString(),
    filePath,
    admonitions: DefaultAdmonitionOptions,
    markdownConfig: {
      mermaid: false,
      mdx1Compat: {
        admonitions: true,
        comments: false,
        headingIds: false,
      },
    },
  });

  /*
  // TODO we shouldn't use rehype in these tests
  // this requires to re-implement admonitions with mdxJsxFlowElement
  const {default: mdx} = await import('remark-mdx');
  const result = await remark()
    .use(directives)
    .use(plugin)
    .use(mdx)
    .process(fileContentPreprocessed);
  return result.value;
   */

  const result = await remark()
    .use(directives)
    .use(plugin, options)
    .use(remark2rehype)
    .use(stringify)
    .process(fileContentPreprocessed);

  return result.value;
};

describe('admonitions remark plugin', () => {
  it('base', async () => {
    const result = await processFixture('base');
    await expect(result).toMatchSnapshot();
  });

  it('default behavior for custom keyword', async () => {
    const result = await processFixture('base', {
      keywords: ['tip'],
      extendDefaults: undefined, // By default we extend
    });
    expect(result).toMatchSnapshot();
  });

  it('add custom keyword', async () => {
    const result = await processFixture('base', {
      keywords: ['tip'],
      extendDefaults: true,
    });
    expect(result).toMatchSnapshot();
  });

  it('replace custom keyword', async () => {
    const result = await processFixture('base', {
      keywords: ['tip'],
      extendDefaults: false,
    });
    expect(result).toMatchSnapshot();
  });

  it('interpolation', async () => {
    const result = await processFixture('interpolation');
    expect(result).toMatchSnapshot();
  });

  it('nesting', async () => {
    const result = await processFixture('nesting');
    expect(result).toMatchSnapshot();
  });

  it('attributes', async () => {
    const result = await processFixture('attributes');
    await expect(result).toMatchSnapshot();
  });
});
