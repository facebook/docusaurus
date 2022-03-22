/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {genChunkName, readOutputHTMLFile, generate} from '../emitUtils';
import path from 'path';
import fs from 'fs-extra';

describe('genChunkName', () => {
  it('works', () => {
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
  });

  it("doesn't allow different chunk name for same path", () => {
    expect(genChunkName('path/is/similar', 'oldPrefix')).toEqual(
      genChunkName('path/is/similar', 'newPrefix'),
    );
  });

  it('emits different chunk names for different paths even with same preferred name', () => {
    const secondAssert: Record<string, string> = {
      '/blog/1': 'blog-85-f-089',
      '/blog/2': 'blog-353-489',
    };
    Object.keys(secondAssert).forEach((str) => {
      expect(genChunkName(str, undefined, 'blog')).toBe(secondAssert[str]);
    });
  });

  it('only generates short unique IDs', () => {
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
});

describe('readOutputHTMLFile', () => {
  it('trailing slash undefined', async () => {
    await expect(
      readOutputHTMLFile(
        '/file',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('file\n');
    await expect(
      readOutputHTMLFile(
        '/folder',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('folder\n');
    await expect(
      readOutputHTMLFile(
        '/file/',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('file\n');
    await expect(
      readOutputHTMLFile(
        '/folder/',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('folder\n');
  });
  it('trailing slash true', async () => {
    await expect(
      readOutputHTMLFile(
        '/folder',
        path.join(__dirname, '__fixtures__/build-snap'),
        true,
      ).then(String),
    ).resolves.toBe('folder\n');
    await expect(
      readOutputHTMLFile(
        '/folder/',
        path.join(__dirname, '__fixtures__/build-snap'),
        true,
      ).then(String),
    ).resolves.toBe('folder\n');
  });
  it('trailing slash false', async () => {
    await expect(
      readOutputHTMLFile(
        '/file',
        path.join(__dirname, '__fixtures__/build-snap'),
        false,
      ).then(String),
    ).resolves.toBe('file\n');
    await expect(
      readOutputHTMLFile(
        '/file/',
        path.join(__dirname, '__fixtures__/build-snap'),
        false,
      ).then(String),
    ).resolves.toBe('file\n');
  });
});

describe('generate', () => {
  const writeMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});
  const existsMock = jest.spyOn(fs, 'pathExists');
  const readMock = jest.spyOn(fs, 'readFile');

  it('works with no file and no cache', async () => {
    existsMock.mockImplementationOnce(() => false);
    await generate(__dirname, 'foo', 'bar');
    expect(writeMock).toHaveBeenNthCalledWith(
      1,
      path.join(__dirname, 'foo'),
      'bar',
    );
  });

  it('works with existing cache', async () => {
    await generate(__dirname, 'foo', 'bar');
    expect(writeMock).toBeCalledTimes(1);
  });

  it('works with existing file but no cache', async () => {
    existsMock.mockImplementationOnce(() => true);
    // @ts-expect-error: seems the typedef doesn't understand overload
    readMock.mockImplementationOnce(() => Promise.resolve('bar'));
    await generate(__dirname, 'baz', 'bar');
    expect(writeMock).toBeCalledTimes(1);
  });

  it('works when force skipping cache', async () => {
    await generate(__dirname, 'foo', 'bar', true);
    expect(writeMock).toHaveBeenNthCalledWith(
      2,
      path.join(__dirname, 'foo'),
      'bar',
    );
  });
});
