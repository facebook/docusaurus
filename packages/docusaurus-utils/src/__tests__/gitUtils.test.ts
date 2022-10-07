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
    expect(getFileCommitDate(path.join(repoDir, 'test.txt'), {})).toEqual({
      date: new Date('2020-06-19'),
      timestamp: new Date('2020-06-19').getTime() / 1000,
    });
    expect(getFileCommitDate(path.join(repoDir, 'dest.txt'), {})).toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime() / 1000,
    });
  });
  it('returns latest commit date', async () => {
    expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {age: 'newest'}),
    ).toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime() / 1000,
    });
    expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {age: 'newest'}),
    ).toEqual({
      date: new Date('2020-11-13'),
      timestamp: new Date('2020-11-13').getTime() / 1000,
    });
  });
  it('returns latest commit date with author', async () => {
    expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {
        age: 'oldest',
        includeAuthor: true,
      }),
    ).toEqual({
      date: new Date('2020-06-19'),
      timestamp: new Date('2020-06-19').getTime() / 1000,
      author: 'Caroline',
    });
    expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {
        age: 'oldest',
        includeAuthor: true,
      }),
    ).toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime() / 1000,
      author: 'Caroline',
    });
  });
  it('returns earliest commit date with author', async () => {
    expect(
      getFileCommitDate(path.join(repoDir, 'test.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).toEqual({
      date: new Date('2020-09-13'),
      timestamp: new Date('2020-09-13').getTime() / 1000,
      author: 'Caroline',
    });
    expect(
      getFileCommitDate(path.join(repoDir, 'dest.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).toEqual({
      date: new Date('2020-11-13'),
      timestamp: new Date('2020-11-13').getTime() / 1000,
      author: 'Josh-Cena',
    });
  });
  it('throws custom error when file is not tracked', async () => {
    expect(() =>
      getFileCommitDate(path.join(repoDir, 'untracked.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).toThrow(FileNotTrackedError);
  });
  it('throws when file not found', async () => {
    expect(() =>
      getFileCommitDate(path.join(repoDir, 'nonexistent.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).toThrow(
      /Failed to retrieve git history for ".*nonexistent.txt" because the file does not exist./,
    );
  });
});
