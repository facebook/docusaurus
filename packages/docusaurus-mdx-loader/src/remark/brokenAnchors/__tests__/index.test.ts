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
import plugin from '../index';
import admonition from '../../admonitions';
import type {WebpackCompilerName} from '@docusaurus/utils';

const processFixture = async (
  name: string,
  {compilerName}: {compilerName: WebpackCompilerName},
) => {
  const {remark} = await import('remark');

  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  file.data.compilerName = compilerName;

  const result = await remark()
    .use(admonition)
    .use(plugin)
    .use(remark2rehype)
    .use(stringify)
    .process(file);

  return result.value;
};

describe('directives remark plugin - client compiler', () => {
  const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => jest.clearAllMocks());

  const options = {compilerName: 'client'} as const;

  it('default behavior for hello file', async () => {
    const result = await processFixture('hello', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls).toMatchSnapshot('console');
  });

  it('default behavior for world file', async () => {
    const result = await processFixture('world', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls).toMatchSnapshot('console');
  });
});
