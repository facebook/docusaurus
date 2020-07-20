/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {join} from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '../index';
import slug from '../../slug/index';

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(slug)
    .use(mdx)
    .use(plugin, options)
    .process(file);

  return result.toString();
};

test('fail if image donot exists', async () => {
  expect(
    processFixture('fail', {staticDir: join(__dirname, 'fixtures')}),
  ).rejects.toBeInstanceOf(Error);
});

test('transform md images to <img />', async () => {
  const result = await processFixture('img', {
    staticDir: join(__dirname, 'fixtures'),
  });
  expect(result).toMatchSnapshot();
});
