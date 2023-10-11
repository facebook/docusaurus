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
import plugin from '../index';

const processFixture = async (name: string) => {
  const {remark} = await import('remark');
  const {default: directives} = await import('remark-directive');

  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  const fileContentPreprocessed = preprocessor({
    fileContent: file.toString(),
    filePath,
    markdownConfig: {
      mermaid: false,
      mdx1Compat: {
        admonitions: false,
        comments: false,
        headingIds: false,
      },
    },
  });

  const result = await remark()
    .use(directives)
    .use(plugin)
    .use(remark2rehype)
    .use(stringify)
    .process(fileContentPreprocessed);

  return result.value;
};

describe('directives remark plugin', () => {
  it('default behavior for custom keyword', async () => {
    const result = await processFixture('directives');
    expect(result).toMatchSnapshot();
  });
});
