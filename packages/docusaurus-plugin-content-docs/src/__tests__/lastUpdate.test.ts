/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import spawn from 'cross-spawn';

import lastUpdate from '../lastUpdate';

describe('lastUpdate', () => {
  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/docs/hello.md',
  );
  test('existing test file in repository with Git timestamp', () => {
    const lastUpdateData = lastUpdate(existingFilePath);
    expect(lastUpdateData).not.toBeNull();

    const {author, timestamp} = lastUpdateData;
    expect(author).not.toBeNull();
    expect(typeof author).toBe('string');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
  });

  test('non-existing file', () => {
    const nonExistingFilePath = path.join(
      __dirname,
      '__fixtures__',
      '.nonExisting',
    );
    expect(lastUpdate(null)).toBeNull();
    expect(lastUpdate(undefined)).toBeNull();
    expect(lastUpdate(nonExistingFilePath)).toBeNull();
  });

  test('temporary created file that has no git timestamp', () => {
    const tempFilePath = path.join(__dirname, '__fixtures__', '.temp');
    fs.writeFileSync(tempFilePath, 'Lorem ipsum :)');
    expect(lastUpdate(tempFilePath)).toBeNull();
    fs.unlinkSync(tempFilePath);
  });

  test('Git does not exist', () => {
    const mock = jest.spyOn(shell, 'which').mockImplementationOnce(() => null);
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
    const lastUpdateData = lastUpdate(existingFilePath);
    expect(lastUpdateData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(
      'Sorry, the docs plugin last update options require Git.',
    );

    consoleMock.mockRestore();
    mock.mockRestore();
  });

  test('Error', () => {
    const mock = jest.spyOn(spawn, 'sync').mockImplementationOnce(() => {
      throw new Error('PERMISSION Error');
    });
    const consoleMock = jest.spyOn(console, 'error').mockImplementation();
    const lastUpdateData = lastUpdate('/fake/path/');
    expect(lastUpdateData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(new Error('PERMISSION Error'));

    consoleMock.mockRestore();
    mock.mockRestore();
  });
});
