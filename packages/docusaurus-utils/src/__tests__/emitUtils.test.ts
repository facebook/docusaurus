/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import {readOutputHTMLFile, generate} from '../emitUtils';

describe('readOutputHTMLFile', () => {
  it('reads both files with trailing slash undefined', async () => {
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
  it('reads only folder with trailing slash true', async () => {
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
  it('reads only file trailing slash false', async () => {
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
  it('reads file ending in .html', async () => {
    await expect(
      readOutputHTMLFile(
        '/htmlFile.html',
        path.join(__dirname, '__fixtures__/build-snap'),
        false,
      ).then(String),
    ).resolves.toBe('htmlFile.html\n');
    await expect(
      readOutputHTMLFile(
        '/htmlFile.html',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('htmlFile.html\n');
  });
  it('reads file ending in .html in folder containing .html', async () => {
    await expect(
      readOutputHTMLFile(
        '/weird.html.folder/nestedHtmlFile.html',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('nestedHtmlFile.html\n');
    await expect(
      readOutputHTMLFile(
        '/weird.html.folder/nestedHtmlFile.html',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).resolves.toBe('nestedHtmlFile.html\n');
  });
  // Can it ever happen?
  it('throws if file does not exist', async () => {
    await expect(
      readOutputHTMLFile(
        '/nonExistent',
        path.join(__dirname, '__fixtures__/build-snap'),
        undefined,
      ).then(String),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Expected output HTML file to be found at <PROJECT_ROOT>/packages/docusaurus-utils/src/__tests__/__fixtures__/build-snap/nonExistent/index.html for permalink /nonExistent."`,
    );
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
    expect(writeMock).toHaveBeenCalledTimes(1);
  });

  it('works with existing file but no cache', async () => {
    existsMock.mockImplementationOnce(() => true);
    // @ts-expect-error: seems the typedef doesn't understand overload
    readMock.mockImplementationOnce(() => Promise.resolve('bar'));
    await generate(__dirname, 'baz', 'bar');
    expect(writeMock).toHaveBeenCalledTimes(1);
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
