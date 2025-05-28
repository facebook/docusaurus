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
  getGitLastUpdate,
  LAST_UPDATE_FALLBACK,
  LAST_UPDATE_UNTRACKED_GIT_FILEPATH,
  readLastUpdateData,
} from '../lastUpdateUtils';
import type {FrontMatterLastUpdate} from '../lastUpdateUtils';

describe('getGitLastUpdate', () => {
  const {repoDir} = createTempRepo();

  const existingFilePath = path.join(
    __dirname,
    '__fixtures__/simple-site/hello.md',
  );
  it('existing test file in repository with Git timestamp', async () => {
    const lastUpdateData = await getGitLastUpdate(existingFilePath);
    expect(lastUpdateData).not.toBeNull();

    const {lastUpdatedAt, lastUpdatedBy} = lastUpdateData!;
    expect(lastUpdatedBy).not.toBeNull();
    expect(typeof lastUpdatedBy).toBe('string');

    expect(lastUpdatedAt).not.toBeNull();
    expect(typeof lastUpdatedAt).toBe('number');
  });

  it('existing test file with spaces in path', async () => {
    const filePathWithSpace = path.join(
      __dirname,
      '__fixtures__/simple-site/doc with space.md',
    );
    const lastUpdateData = await getGitLastUpdate(filePathWithSpace);
    expect(lastUpdateData).not.toBeNull();

    const {lastUpdatedBy, lastUpdatedAt} = lastUpdateData!;
    expect(lastUpdatedBy).not.toBeNull();
    expect(typeof lastUpdatedBy).toBe('string');

    expect(lastUpdatedAt).not.toBeNull();
    expect(typeof lastUpdatedAt).toBe('number');
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
});

describe('readLastUpdateData', () => {
  const testDate = '2021-01-01';
  const testTimestamp = new Date(testDate).getTime();
  const testAuthor = 'ozaki';

  describe('on untracked Git file', () => {
    function test(lastUpdateFrontMatter: FrontMatterLastUpdate | undefined) {
      return readLastUpdateData(
        LAST_UPDATE_UNTRACKED_GIT_FILEPATH,
        {showLastUpdateAuthor: true, showLastUpdateTime: true},
        lastUpdateFrontMatter,
      );
    }

    it('reads null at/by from Git', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await test({});
      expect(lastUpdatedAt).toBeNull();
      expect(lastUpdatedBy).toBeNull();
    });

    it('reads null at from Git and author from front matter', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await test({author: testAuthor});
      expect(lastUpdatedAt).toBeNull();
      expect(lastUpdatedBy).toEqual(testAuthor);
    });

    it('reads null by from Git and date from front matter', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await test({date: testDate});
      expect(lastUpdatedBy).toBeNull();
      expect(lastUpdatedAt).toEqual(testTimestamp);
    });
  });

  it('read last time show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {date: testDate},
    );
    expect(lastUpdatedAt).toEqual(testTimestamp);
    expect(lastUpdatedBy).toBe(LAST_UPDATE_FALLBACK.lastUpdatedBy);
  });

  it('read last author show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toBe(LAST_UPDATE_FALLBACK.lastUpdatedAt);
  });

  it('read last all show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last default show none', async () => {
    const lastUpdate = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: false},
      {},
    );
    expect(lastUpdate).toEqual({});
  });

  it('read last author show none', async () => {
    const lastUpdate = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: false},
      {author: testAuthor},
    );
    expect(lastUpdate).toEqual({});
  });

  it('read last time show author', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {date: testDate},
    );
    expect(lastUpdatedBy).toBe(LAST_UPDATE_FALLBACK.lastUpdatedBy);
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last author show author', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toBe('ozaki');
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last default show author default', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {},
    );
    expect(lastUpdatedBy).toBe(LAST_UPDATE_FALLBACK.lastUpdatedBy);
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last time show time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {date: testDate},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last author show time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(LAST_UPDATE_FALLBACK.lastUpdatedAt);
  });

  it('read last author show time only - both front matter', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last author show author only - both front matter', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readLastUpdateData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toBeUndefined();
  });
});
