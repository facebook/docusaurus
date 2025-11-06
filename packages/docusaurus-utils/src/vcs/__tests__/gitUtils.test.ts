/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {createTempRepo} from '@testing-utils/git';
import execa from 'execa';
import {
  FileNotTrackedError,
  getFileCommitDate,
  getGitLastUpdate,
  getGitCreation,
} from '../gitUtils';

/* eslint-disable no-restricted-properties */
function initializeTempRepo() {
  const {repoDir, git} = createTempRepo();

  fs.writeFileSync(path.join(repoDir, 'test.txt'), 'Some content');
  git.commit(
    'Create test.txt',
    '2020-06-19',
    'Caroline <caroline@jc-verse.com>',
  );
  fs.writeFileSync(path.join(repoDir, 'test.txt'), 'Updated content');
  git.commit(
    'Update test.txt',
    '2020-06-20',
    'Josh-Cena <josh-cena@jc-verse.com>',
  );
  fs.writeFileSync(path.join(repoDir, 'test.txt'), 'Updated content (2)');
  fs.writeFileSync(path.join(repoDir, 'moved.txt'), 'This file is moved');
  git.commit(
    'Update test.txt again, create moved.txt',
    '2020-09-13',
    'Caroline <caroline@jc-verse.com>',
  );
  fs.moveSync(path.join(repoDir, 'moved.txt'), path.join(repoDir, 'dest.txt'));
  git.commit(
    'Rename moved.txt to dest.txt',
    '2020-11-13',
    'Josh-Cena <josh-cena@jc-verse.com>',
  );
  fs.writeFileSync(path.join(repoDir, 'untracked.txt'), "I'm untracked");

  return repoDir;
}

describe('getFileCommitDate', () => {
  const repoDir = initializeTempRepo();

  it('returns earliest commit date', async () => {
    await expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {}),
    ).resolves.toEqual({
      date: new Date('2020-06-19'),
      timestamp: new Date('2020-06-19').getTime(),
    });
    await expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {}),
    ).resolves.toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime(),
    });
  });

  it('returns latest commit date', async () => {
    await expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {age: 'newest'}),
    ).resolves.toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime(),
    });
    await expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {age: 'newest'}),
    ).resolves.toEqual({
      date: new Date('2020-11-13'),
      timestamp: new Date('2020-11-13').getTime(),
    });
  });

  it('returns latest commit date with author', async () => {
    await expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {
        age: 'oldest',
        includeAuthor: true,
      }),
    ).resolves.toEqual({
      date: new Date('2020-06-19'),
      timestamp: new Date('2020-06-19').getTime(),
      author: 'Caroline',
    });
    await expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {
        age: 'oldest',
        includeAuthor: true,
      }),
    ).resolves.toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime(),
      author: 'Caroline',
    });
  });

  it('returns earliest commit date with author', async () => {
    await expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).resolves.toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime(),
      author: 'Caroline',
    });
    await expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).resolves.toEqual({
      date: new Date('2020-11-13'),
      timestamp: new Date('2020-11-13').getTime(),
      author: 'Josh-Cena',
    });
  });

  it('throws custom error when file is not tracked', async () => {
    await expect(() =>
      getFileCommitDate(path.join(repoDir, 'untracked.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).rejects.toThrow(FileNotTrackedError);
  });

  it('throws when file not found', async () => {
    await expect(() =>
      getFileCommitDate(path.join(repoDir, 'nonexistent.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).rejects.toThrow(
      /Failed to retrieve git history for ".*nonexistent.txt" because the file does not exist./,
    );
  });
});

describe('getGitLastUpdate', () => {
  const {repoDir} = createTempRepo();

  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/docs/doc1.md',
  );

  it('existing test file in repository with Git timestamp', async () => {
    const lastUpdateData = await getGitLastUpdate(existingFilePath);
    expect(lastUpdateData).not.toBeNull();

    const {timestamp, author} = lastUpdateData!;
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
    const lastUpdateData = await getGitLastUpdate(filePathWithSpace);
    expect(lastUpdateData).not.toBeNull();

    const {timestamp, author} = lastUpdateData!;
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
    await expect(getGitLastUpdate(nonExistingFilePath)).rejects.toThrow(
      /An error occurred when trying to get the last update date/,
    );
    expect(consoleMock).toHaveBeenCalledTimes(0);
    consoleMock.mockRestore();
  });

  it('git does not exist', async () => {
    const mock = jest.spyOn(execa, 'sync').mockImplementationOnce(() => {
      throw new Error('Git does not exist');
    });

    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const lastUpdateData = await getGitLastUpdate(existingFilePath);
    expect(lastUpdateData).toBeNull();
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(
        /.*\[WARNING\].* Sorry, the last update options require Git\..*/,
      ),
    );

    consoleMock.mockRestore();
    mock.mockRestore();
  });

  it('temporary created file that is not tracked by git', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const tempFilePath = path.join(repoDir, 'file.md');
    await fs.writeFile(tempFilePath, 'Lorem ipsum :)');
    await expect(getGitLastUpdate(tempFilePath)).resolves.toBeNull();
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
    const tempFilePath1 = path.join(repoDir, 'file1.md');
    const tempFilePath2 = path.join(repoDir, 'file2.md');
    await fs.writeFile(tempFilePath1, 'Lorem ipsum :)');
    await fs.writeFile(tempFilePath2, 'Lorem ipsum :)');
    await expect(getGitLastUpdate(tempFilePath1)).resolves.toBeNull();
    await expect(getGitLastUpdate(tempFilePath2)).resolves.toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/not tracked by git./),
    );
    await fs.unlink(tempFilePath1);
    await fs.unlink(tempFilePath2);
  });
});

describe('test repo commit info', () => {
  const repoDir = initializeTempRepo();

  it('returns creation info for test.txt', async () => {
    const filePath = path.join(repoDir, 'test.txt');
    await expect(getGitCreation(filePath)).resolves.toEqual({
      author: 'Caroline',
      timestamp: new Date('2020-06-19').getTime(),
    });

    await expect(getGitLastUpdate(filePath)).resolves.toEqual({
      author: 'Caroline',
      timestamp: new Date('2020-09-13').getTime(),
    });
  });

  it('returns creation info for dest.txt', async () => {
    const filePath = path.join(repoDir, 'dest.txt');
    await expect(getGitCreation(filePath)).resolves.toEqual({
      author: 'Caroline',
      timestamp: new Date('2020-09-13').getTime(),
    });
    await expect(getGitLastUpdate(filePath)).resolves.toEqual({
      author: 'Josh-Cena',
      timestamp: new Date('2020-11-13').getTime(),
    });
  });

  it('returns creation info for untracked.txt', async () => {
    const filePath = path.join(repoDir, 'untracked.txt');
    await expect(getGitCreation(filePath)).resolves.toEqual(null);
    await expect(getGitLastUpdate(filePath)).resolves.toEqual(null);
  });

  it('returns creation info for non-existing.txt', async () => {
    const filePath = path.join(repoDir, 'non-existing.txt');
    await expect(
      getGitCreation(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"An error occurred when trying to get the last update date"`,
    );
    await expect(
      getGitLastUpdate(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"An error occurred when trying to get the last update date"`,
    );
  });
});
