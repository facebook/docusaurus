/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import '@babel/polyfill';
import {join} from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '../index';

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.mdx`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(mdx)
    .use(plugin, options)
    .process(file);

  return result.toString();
};

test('no options', async () => {
  const options = undefined;
  const result = await processFixture('just-content', options);
  expect(result).toMatchSnapshot();
});

test('should export even with existing name', async () => {
  const result = await processFixture('name-exist');
  expect(result).toMatchSnapshot();
});

test('should export with custom name', async () => {
  const options = {
    name: 'customName',
  };
  const result = await processFixture('just-content', options);
  expect(result).toMatchSnapshot();
});

test('should insert below imports', async () => {
  const result = await processFixture('insert-below-imports');
  expect(result).toMatchSnapshot();
});

test('empty headings', async () => {
  const result = await processFixture('empty-headings');
  expect(result).toMatchSnapshot();
});
