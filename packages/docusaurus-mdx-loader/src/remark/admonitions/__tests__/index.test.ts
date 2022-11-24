/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import remark from 'remark';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';

import vfile from 'to-vfile';
import plugin from '../index';
import type {AdmonitionOptions} from '../index';

const processFixture = async (
  name: string,
  options?: Partial<AdmonitionOptions>,
) => {
  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);

  const result = await remark()
    .use(plugin, options)
    .use(remark2rehype)
    .use(stringify)
    .process(file);

  return result.toString();
};

describe('admonitions remark plugin', () => {
  it('base', async () => {
    const result = await processFixture('base');
    expect(result).toMatchSnapshot();
  });

  it('default behavior for custom keyword', async () => {
    const result = await processFixture('base', {
      keywords: ['tip'],
      // extendDefaults: false, // By default we don't extend
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

  it('custom tag', async () => {
    const result = await processFixture('base', {
      tag: '++++',
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
});
