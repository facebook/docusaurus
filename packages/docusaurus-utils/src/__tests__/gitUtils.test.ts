/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {FileNotTrackedError, getFileCommitDate} from '../gitUtils';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import shell from 'shelljs';

// This function is sync so the same mock repo can be shared across tests
/* eslint-disable no-restricted-properties */
function createTempRepo() {
  const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-test-repo'));
  class Git {
    constructor(private dir: string) {
      const res = shell.exec('git init', {cwd: dir, silent: true});
      if (res.code !== 0) {
        throw new Error(`git init exited with code ${res.code}.
stderr: ${res.stderr}
stdout: ${res.stdout}`);
      }
      // Doesn't matter currently
      shell.exec('git config user.email "test@jc-verse.com"', {
        cwd: dir,
        silent: true,
      });
      shell.exec('git config user.name "Test"', {cwd: dir, silent: true});
    }
    commit(msg: string, date: string, author: string) {
      const addRes = shell.exec('git add .', {cwd: this.dir, silent: true});
      const commitRes = shell.exec(
        `git commit -m "${msg}" --date "${date}T00:00:00Z" --author "${author}"`,
        {
          cwd: this.dir,
          env: {GIT_COMMITTER_DATE: `${date}T00:00:00Z`},
          silent: true,
        },
      );
      if (addRes.code !== 0) {
        throw new Error(`git add exited with code ${addRes.code}.
stderr: ${addRes.stderr}
stdout: ${addRes.stdout}`);
      }
      if (commitRes.code !== 0) {
        throw new Error(`git commit exited with code ${commitRes.code}.
stderr: ${commitRes.stderr}
stdout: ${commitRes.stdout}`);
      }
    }
  }
  const git = new Git(repoDir);
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
  const repoDir = createTempRepo();
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
    ).toThrowError(FileNotTrackedError);
  });
  it('throws when file not found', async () => {
    expect(() =>
      getFileCommitDate(path.join(repoDir, 'nonexistent.txt'), {
        age: 'newest',
        includeAuthor: true,
      }),
    ).toThrowError(
      /Failed to retrieve git history for ".*nonexistent.txt" because the file does not exist./,
    );
  });
});
