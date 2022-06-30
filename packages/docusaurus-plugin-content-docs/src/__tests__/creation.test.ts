/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import shell from 'shelljs';
import {createTempRepo} from '@testing-utils/git';

import {getFileCreation} from '../fileChangeData';

describe('getFileCreation', () => {
  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/docs/hello.md',
  );
  it('existing test file in repository with Git timestamp', async () => {
    const creationData = await getFileCreation(existingFilePath);
    expect(creationData).not.toBeNull();

    const {author, timestamp} = creationData;
    expect(author).not.toBeNull();
    expect(typeof author).toBe('string');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
  });

  it('existing test file with spaces in path', async () => {
    const filePathWithSpace = path.join(
      __dirname,
      '__fixtures__/simple-site/docs/doc with space.md',
    );
    const creationData = await getFileCreation(filePathWithSpace);
    expect(creationData).not.toBeNull();

    const {author, timestamp} = creationData;
    expect(author).not.toBeNull();
    expect(typeof author).toBe('string');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
  });

  it('non-existing file', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const nonExistingFileName = '.nonExisting';
    const nonExistingFilePath = path.join(
      __dirname,
      '__fixtures__',
      nonExistingFileName,
    );
    await expect(getFileCreation(nonExistingFilePath)).resolves.toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/because the file does not exist./),
    );
    await expect(getFileCreation(null)).resolves.toBeNull();
    await expect(getFileCreation(undefined)).resolves.toBeNull();
    consoleMock.mockRestore();
  });

  it('temporary created file that is not tracked by git', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const {repoDir} = createTempRepo();
    const tempFilePath = path.join(repoDir, 'file.md');
    await fs.writeFile(tempFilePath, 'Lorem ipsum :)');
    await expect(getFileCreation(tempFilePath)).resolves.toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/not tracked by git./),
    );
    await fs.unlink(tempFilePath);
  });

  it('multiple files not tracked by git', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const {repoDir} = createTempRepo();
    const tempFilePath1 = path.join(repoDir, 'file1.md');
    const tempFilePath2 = path.join(repoDir, 'file2.md');
    await fs.writeFile(tempFilePath1, 'Lorem ipsum :)');
    await fs.writeFile(tempFilePath2, 'Lorem ipsum :)');
    await expect(getFileCreation(tempFilePath1)).resolves.toBeNull();
    await expect(getFileCreation(tempFilePath2)).resolves.toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/not tracked by git./),
    );
    await fs.unlink(tempFilePath1);
    await fs.unlink(tempFilePath2);
  });

  it('git does not exist', async () => {
    const mock = jest.spyOn(shell, 'which').mockImplementationOnce(() => null);
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const creationData = await getFileCreation(existingFilePath);
    expect(creationData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(
        /.*\[WARNING\].* Sorry, the docs plugin creation options require Git\..*/,
      ),
    );

    consoleMock.mockRestore();
    mock.mockRestore();
  });
});
