/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import {getFileLastUpdate} from '../lastUpdate';

describe('lastUpdate', () => {
  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/docs/hello.md',
  );
  test('existing test file in repository with Git timestamp', async () => {
    const lastUpdateData = await getFileLastUpdate(existingFilePath);
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
    const nonExistingFileName = '.nonExisting';
    const nonExistingFilePath = path.join(
      __dirname,
      '__fixtures__',
      nonExistingFileName,
    );
    expect(await getFileLastUpdate(nonExistingFilePath)).toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls[0][0].message).toContain(
      `Command failed with exit code 128: git log -1 --format=%ct, %an ${nonExistingFileName}`,
    );
    expect(await getFileLastUpdate(null)).toBeNull();
    expect(await getFileLastUpdate(undefined)).toBeNull();
    consoleMock.mockRestore();
  });

  test('temporary created file that has no git timestamp', async () => {
    const tempFilePath = path.join(__dirname, '__fixtures__', '.temp');
    fs.writeFileSync(tempFilePath, 'Lorem ipsum :)');
    expect(await getFileLastUpdate(tempFilePath)).toBeNull();
    fs.unlinkSync(tempFilePath);
  });

  test('Git does not exist', async () => {
    const mock = jest.spyOn(shell, 'which').mockImplementationOnce(() => null);
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
    const lastUpdateData = await getFileLastUpdate(existingFilePath);
    expect(lastUpdateData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(
      'Sorry, the docs plugin last update options require Git.',
    );

    consoleMock.mockRestore();
    mock.mockRestore();
  });
});
