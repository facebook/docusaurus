/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import execa from 'execa';

import {
  FileNotTrackedError,
  getFileCommitDate,
  getGitLastUpdate,
  getGitCreation,
  getGitRepoRoot,
} from '../gitUtils';

class Git {
  private constructor(private dir: string) {
    this.dir = dir;
  }

  private static async runOptimisticGitCommand({
    cwd,
    cmd,
    args,
    options,
  }: {
    cwd: string;
    args: string[];
    cmd: string;
    options?: execa.Options;
  }): Promise<execa.ExecaReturnValue> {
    const res = await execa(cmd, args, {
      cwd,
      silent: true,
      shell: true,
      ...options,
    });
    if (res.exitCode !== 0) {
      throw new Error(
        `Git command failed with code ${res.exitCode}: ${cmd} ${args.join(
          ' ',
        )}`,
      );
    }
    return res;
  }

  static async initializeRepo(dir: string): Promise<Git> {
    await Git.runOptimisticGitCommand({
      cmd: 'git',
      args: ['init'],
      cwd: dir,
    });
    await Git.runOptimisticGitCommand({
      cmd: 'git',
      args: ['config', 'user.email', '"test@example.com"'],
      cwd: dir,
    });
    await Git.runOptimisticGitCommand({
      cmd: 'git',
      args: ['config', 'user.name', '"Test"'],
      cwd: dir,
    });
    await Git.runOptimisticGitCommand({
      cmd: 'git',
      args: ['commit', '--allow-empty', '-m "First commit"'],
      cwd: dir,
    });
    return new Git(dir);
  }

  async runOptimisticGitCommand(
    cmd: string,
    args?: string[],
    options?: execa.Options,
  ): Promise<execa.ExecaReturnValue> {
    return Git.runOptimisticGitCommand({cwd: this.dir, cmd, args, options});
  }

  async commit(msg: string, date: string, author: string): Promise<void> {
    await this.runOptimisticGitCommand('git', ['add', '.']);
    await this.runOptimisticGitCommand(
      `git`,
      [
        'commit',
        `-m "${msg}"`,
        `--date "${date}T00:00:00Z"`,
        `--author "${author}"`,
      ],
      {env: {GIT_COMMITTER_DATE: `${date}T00:00:00Z`}},
    );
  }
}

async function createGitRepoEmpty(): Promise<{repoDir: string; git: Git}> {
  let repoDir = await fs.mkdtemp(path.join(os.tmpdir(), 'git-test-repo'));
  repoDir = await fs.realpath(repoDir);
  const git = await Git.initializeRepo(repoDir);
  return {repoDir, git};
}

describe('commit info APIs', () => {
  async function createGitRepoTestFixture() {
    const {repoDir, git} = await createGitRepoEmpty();

    await fs.writeFile(path.join(repoDir, 'test.txt'), 'Some content');
    await git.commit(
      'Create test.txt',
      '2020-06-19',
      'Caroline <caroline@jc-verse.com>',
    );
    await fs.writeFile(path.join(repoDir, 'test.txt'), 'Updated content');
    await git.commit(
      'Update test.txt',
      '2020-06-20',
      'Josh-Cena <josh-cena@jc-verse.com>',
    );
    await fs.writeFile(path.join(repoDir, 'test.txt'), 'Updated content (2)');
    await fs.writeFile(path.join(repoDir, 'moved.txt'), 'This file is moved');
    await git.commit(
      'Update test.txt again, create moved.txt',
      '2020-09-13',
      'Caroline <caroline@jc-verse.com>',
    );
    await fs.move(
      path.join(repoDir, 'moved.txt'),
      path.join(repoDir, 'dest.txt'),
    );
    await git.commit(
      'Rename moved.txt to dest.txt',
      '2020-11-13',
      'Josh-Cena <josh-cena@jc-verse.com>',
    );
    await fs.writeFile(path.join(repoDir, 'untracked.txt'), "I'm untracked");

    return repoDir;
  }

  describe('getFileCommitDate', () => {
    it('returns earliest commit date', async () => {
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

      await expect(() =>
        getFileCommitDate(path.join(repoDir, 'untracked.txt'), {
          age: 'newest',
          includeAuthor: true,
        }),
      ).rejects.toThrow(FileNotTrackedError);
    });

    it('throws when file not found', async () => {
      const repoDir = await createGitRepoTestFixture();

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

  describe('commit info APIs', () => {
    it('returns creation info for test.txt', async () => {
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

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
      const repoDir = await createGitRepoTestFixture();

      const filePath = path.join(repoDir, 'untracked.txt');
      await expect(getGitCreation(filePath)).resolves.toEqual(null);
      await expect(getGitLastUpdate(filePath)).resolves.toEqual(null);
    });

    it('returns creation info for non-existing.txt', async () => {
      const repoDir = await createGitRepoTestFixture();

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
});

describe('getGitRepoRoot', () => {
  async function initTestRepo() {
    const {repoDir, git} = await createGitRepoEmpty();
    await fs.mkdir(path.join(repoDir, 'subdir'));
    await fs.writeFile(
      path.join(repoDir, 'subdir', 'test.txt'),
      'Some content',
    );
    await git.commit(
      'Create test.txt',
      '2020-06-19',
      'Caroline <caroline@jc-verse.com>',
    );
    return repoDir;
  }

  it('returns repoDir for cwd=repoDir', async () => {
    const repoDir = await initTestRepo();
    const cwd = repoDir;
    await expect(getGitRepoRoot(cwd)).resolves.toEqual(repoDir);
  });
});
