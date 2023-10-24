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
  const {default: directives} = await import('remark-directive');

  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  file.data.compilerName = compilerName;

  const result = await remark()
    .use(directives)
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

  it('default behavior for container directives', async () => {
    const result = await processFixture('containerDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls).toMatchSnapshot('console');
  });

  it('default behavior for leaf directives', async () => {
    const result = await processFixture('leafDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls).toMatchSnapshot('console');
  });

  it('default behavior for text directives', async () => {
    const result = await processFixture('textDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls).toMatchSnapshot('console');
  });
});

describe('directives remark plugin - server compiler', () => {
  const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => jest.clearAllMocks());

  const options = {compilerName: 'server'} as const;

  it('default behavior for container directives', async () => {
    const result = await processFixture('containerDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });

  it('default behavior for leaf directives', async () => {
    const result = await processFixture('leafDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });

  it('default behavior for text directives', async () => {
    const result = await processFixture('textDirectives', options);
    expect(result).toMatchSnapshot('result');
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });
});

describe('directives remark plugin - client result === server result', () => {
  // It is important that client/server outputs are exactly the same
  // otherwise React hydration mismatches can occur
  async function testSameResult(name: string) {
    const resultClient = await processFixture(name, {compilerName: 'client'});
    const resultServer = await processFixture(name, {compilerName: 'server'});
    expect(resultClient).toEqual(resultServer);
  }

  it('for containerDirectives', async () => {
    await testSameResult('containerDirectives');
  });

  it('for leafDirectives', async () => {
    await testSameResult('leafDirectives');
  });

  it('for textDirectives', async () => {
    await testSameResult('textDirectives');
  });
});
