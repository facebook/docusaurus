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
import plugin from '..';

const processFixture = async (name: string) => {
  const file = await vfile.read(path.join(__dirname, '__fixtures__', name));
  const result = await remark().use(mdx).use(plugin).process(file);
  return result.toString();
};

const processFixtureAST = async (name: string) => {
  const file = await vfile.read(path.join(__dirname, '__fixtures__', name));
  return remark().use(mdx).use(plugin).parse(file);
};

describe('unwrapMdxCodeBlocks remark plugin', () => {
  it('unwraps the mdx code blocks', async () => {
    const result = await processFixture('has-mdx-code-blocks.mdx');
    expect(result).toMatchSnapshot();
  });

  // The AST output should be parsed correctly or the MDX loader won't work!
  it('unwraps the mdx code blocks AST', async () => {
    const result = await processFixtureAST('has-mdx-code-blocks.mdx');
    expect(result).toMatchSnapshot();
  });
});
