/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import remark from 'remark';
import vfile from 'to-vfile';
import plugin from '../index';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';

const processFixture = async (name) => {
  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);

  const result = await remark()
    .use(plugin)
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
});
