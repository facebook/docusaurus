/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {genChunkName, readOutputHTMLFile, generate} from '../emitUtils';
import path from 'path';
import fs from 'fs-extra';

test('genChunkName', () => {
  const firstAssert: Record<string, string> = {
    '/docs/adding-blog': 'docs-adding-blog-062',
    '/docs/versioning': 'docs-versioning-8a8',
    '/': 'index',
    '/blog/2018/04/30/How-I-Converted-Profilo-To-Docusaurus':
      'blog-2018-04-30-how-i-converted-profilo-to-docusaurus-4f2',
    '/youtube': 'youtube-429',
    '/users/en/': 'users-en-f7a',
    '/blog': 'blog-c06',
  };
  Object.keys(firstAssert).forEach((str) => {
    expect(genChunkName(str)).toBe(firstAssert[str]);
  });

  // Don't allow different chunk name for same path.
  expect(genChunkName('path/is/similar', 'oldPrefix')).toEqual(
    genChunkName('path/is/similar', 'newPrefix'),
  );

  // Even with same preferred name, still different chunk name for
  // different path
  const secondAssert: Record<string, string> = {
    '/blog/1': 'blog-85-f-089',
    '/blog/2': 'blog-353-489',
  };
  Object.keys(secondAssert).forEach((str) => {
    expect(genChunkName(str, undefined, 'blog')).toBe(secondAssert[str]);
  });

  // Only generate short unique id
  const thirdAssert: Record<string, string> = {
    a: '0cc175b9',
    b: '92eb5ffe',
    c: '4a8a08f0',
    d: '8277e091',
  };
  Object.keys(thirdAssert).forEach((str) => {
    expect(genChunkName(str, undefined, undefined, true)).toBe(
      thirdAssert[str],
    );
  });
  expect(genChunkName('d', undefined, undefined, true)).toBe('8277e091');
});

describe('readOutputHTMLFile', () => {
  test('trailing slash undefined', async () => {
    await expect(
      readOutputHTMLFile(
        '/file',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toEqual('file\n');
    await expect(
      readOutputHTMLFile(
        '/folder',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toEqual('folder\n');
    await expect(
      readOutputHTMLFile(
        '/file/',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toEqual('file\n');
    await expect(
      readOutputHTMLFile(
        '/folder/',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toEqual('folder\n');
  });
  test('trailing slash true', async () => {
    await expect(
      readOutputHTMLFile(
        '/folder',
        path.join(__dirname, '__fixtures__/build-snap'),
        true,
      ).then(String),
    ).resolves.toEqual('folder\n');
    await expect(
      readOutputHTMLFile(
        '/folder/',
        path.join(__dirname, '__fixtures__/build-snap'),
        true,
      ).then(String),
    ).resolves.toEqual('folder\n');
  });
  test('trailing slash false', async () => {
    await expect(
      readOutputHTMLFile(
        '/file',
        path.join(__dirname, '__fixtures__/build-snap'),
        false,
      ).then(String),
    ).resolves.toEqual('file\n');
    await expect(
      readOutputHTMLFile(
        '/file/',
        path.join(__dirname, '__fixtures__/build-snap'),
        false,
      ).then(String),
    ).resolves.toEqual('file\n');
  });
});

test('generate', async () => {
  const writeMock = jest.spyOn(fs, 'writeFile').mockImplementation(() => {});
  const existsMock = jest.spyOn(fs, 'pathExists');
  const readMock = jest.spyOn(fs, 'readFile');

  // First call: no file, no cache
  existsMock.mockImplementationOnce(() => false);
  await generate(__dirname, 'foo', 'bar');
  expect(writeMock).toHaveBeenNthCalledWith(
    1,
    path.join(__dirname, 'foo'),
    'bar',
  );

  // Second call: cache exists
  await generate(__dirname, 'foo', 'bar');
  expect(writeMock).toBeCalledTimes(1);

  // Generate another: file exists, cache doesn't
  existsMock.mockImplementationOnce(() => true);
  // @ts-expect-error: seems the typedef doesn't understand overload
  readMock.mockImplementationOnce(() => Promise.resolve('bar'));
  await generate(__dirname, 'baz', 'bar');
  expect(writeMock).toBeCalledTimes(1);

  // Generate again: force skip cache
  await generate(__dirname, 'foo', 'bar', true);
  expect(writeMock).toHaveBeenNthCalledWith(
    2,
    path.join(__dirname, 'foo'),
    'bar',
  );
});
