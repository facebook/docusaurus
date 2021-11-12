/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import remark from 'remark';
// import from the transpiled lib because Babel can't transpile `export =` syntax
// TODO change to `../index` after migrating to ESM
import npm2yarn from '../../lib/index';
import vfile from 'to-vfile';
import {join, relative} from 'path';
import mdx from 'remark-mdx';

const staticDir = `./${relative(process.cwd(), join(__dirname, 'fixtures'))}`;

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(mdx)
    .use(npm2yarn, {...options, filePath: path})
    .process(file);

  return result.toString();
};

describe('npm2yarn plugin', () => {
  test('test: installation file', async () => {
    const result = await processFixture('installation', {
      staticDir,
    });

    expect(result).toMatchSnapshot();
  });

  test('test: plugin file', async () => {
    const result = await processFixture('plugin', {
      staticDir,
    });

    expect(result).toMatchSnapshot();
  });

  test('test: language was not setted', async () => {
    const result = await processFixture('syntax-not-properly-set', {
      staticDir,
    });

    expect(result).toMatchSnapshot();
  });

  test('test: already imported tabs components above are not re-imported', async () => {
    const result = await processFixture('import-tabs-above', {
      staticDir,
    });

    expect(result).toMatchSnapshot();
  });

  test('test: already imported tabs components below are not re-imported', async () => {
    const result = await processFixture('import-tabs-below', {
      staticDir,
    });

    expect(result).toMatchSnapshot();
  });
});
