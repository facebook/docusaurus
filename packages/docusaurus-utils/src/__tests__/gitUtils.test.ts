/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {createTempRepo} from '@testing-utils/git';
import {FileNotTrackedError, getFileCommitDate} from '../gitUtils';
import {getGitLastUpdate} from '../lastUpdateUtils';

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

  it('multiple files not tracked by git', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const tempFilePath1 = path.join(repoDir, 'file1.md');
    const tempFilePath2 = path.join(repoDir, 'file2.md');
    await fs.writeFile(tempFilePath1, 'Lorem ipsum :)');
    await fs.writeFile(tempFilePath2, 'Lorem ipsum :)');
    // TODO this is not the correct place to test "getGitLastUpdate"
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
