/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '../index';
import headings from '../../headings/index';

const processFixture = async (name: string) => {
  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  const result = await remark()
    .use(headings)
    .use(mdx)
    .use(plugin)
    .process(file);

  return result.toString();
};

describe('toc remark plugin', () => {
  it('works on non text phrasing content', async () => {
    const result = await processFixture('non-text-content');
    expect(result).toMatchSnapshot();
  });

  it('escapes inline code', async () => {
    const result = await processFixture('inline-code');
    expect(result).toMatchSnapshot();
  });

  it('works on text content', async () => {
    const result = await processFixture('just-content');
    expect(result).toMatchSnapshot();
  });

  it('exports even with existing name', async () => {
    const result = await processFixture('name-exist');
    expect(result).toMatchSnapshot();
  });

  it('inserts below imports', async () => {
    const result = await processFixture('insert-below-imports');
    expect(result).toMatchSnapshot();
  });

  it('handles empty headings', async () => {
    const result = await processFixture('empty-headings');
    expect(result).toMatchSnapshot();
  });
});
