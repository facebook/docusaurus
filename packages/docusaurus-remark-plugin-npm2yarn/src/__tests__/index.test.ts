/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import remark from 'remark';
// import from the transpiled lib because Babel can't transpile `export =`
// TODO change to `../index` after migrating to ESM
import npm2yarn from '../../lib/index';
import vfile from 'to-vfile';
import path from 'path';
import mdx from 'remark-mdx';

const processFixture = async (name: string, options?: {sync?: boolean}) => {
  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  const result = await remark()
    .use(mdx)
    .use(npm2yarn, {...options, filePath})
    .process(file);

  return result.toString();
};

describe('npm2yarn plugin', () => {
  test('test: installation file', async () => {
    const result = await processFixture('installation');

    expect(result).toMatchSnapshot();
  });

  test('test: plugin file', async () => {
    const result = await processFixture('plugin');

    expect(result).toMatchSnapshot();
  });

  test('test: language was not set', async () => {
    const result = await processFixture('syntax-not-properly-set');

    expect(result).toMatchSnapshot();
  });

  test('test: already imported tabs components above are not re-imported', async () => {
    const result = await processFixture('import-tabs-above');

    expect(result).toMatchSnapshot();
  });

  test('test: already imported tabs components below are not re-imported', async () => {
    const result = await processFixture('import-tabs-below');

    expect(result).toMatchSnapshot();
  });
});
