/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */

import remark from 'remark';
import npm2yarn from '../index';
import vfile from 'to-vfile';
import {join, relative} from 'path';
import mdx from 'remark-mdx';
import slug from '../../slug/index';

const staticDir = `./${relative(process.cwd(), join(__dirname, 'fixtures'))}`;

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(slug)
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
});
