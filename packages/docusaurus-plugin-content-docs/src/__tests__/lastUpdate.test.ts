/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import lastUpdate from '../lastUpdate';

describe('lastUpdate', () => {
  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/docs/hello.md',
  );
  test('existing test file in repository with Git timestamp', async () => {
    const lastUpdateData = await lastUpdate(existingFilePath);
    expect(lastUpdateData).not.toBeNull();

    const {author, timestamp} = lastUpdateData;
    expect(author).not.toBeNull();
    expect(typeof author).toBe('string');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
  });

  test('non-existing file', async () => {
    const consoleMock = jest.spyOn(console, 'error');
    consoleMock.mockImplementation();
    const nonExistingFilePath = path.join(
      __dirname,
      '__fixtures__',
      '.nonExisting',
    );
    expect(await lastUpdate(nonExistingFilePath)).toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenCalledWith(
      new Error(
        `Command failed with exit code 128: git log -1 --format=%ct, %an ${nonExistingFilePath}`,
      ),
    );
    expect(await lastUpdate(null)).toBeNull();
    expect(await lastUpdate(undefined)).toBeNull();
    consoleMock.mockRestore();
  });

  test('temporary created file that has no git timestamp', async () => {
    const tempFilePath = path.join(__dirname, '__fixtures__', '.temp');
    fs.writeFileSync(tempFilePath, 'Lorem ipsum :)');
    expect(await lastUpdate(tempFilePath)).toBeNull();
    fs.unlinkSync(tempFilePath);
  });

  test('Git does not exist', async () => {
    const mock = jest.spyOn(shell, 'which').mockImplementationOnce(() => null);
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
    const lastUpdateData = await lastUpdate(existingFilePath);
    expect(lastUpdateData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(
      'Sorry, the docs plugin last update options require Git.',
    );

    consoleMock.mockRestore();
    mock.mockRestore();
  });
});
