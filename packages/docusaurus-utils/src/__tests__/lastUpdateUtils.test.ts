/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {readLastUpdateData} from '../lastUpdateUtils';
import {DEFAULT_TEST_VCS_CONFIG} from '../vcs/vcs';

import type {FrontMatterLastUpdate} from '../lastUpdateUtils';

describe('readLastUpdateData', () => {
  const testDate = '2021-01-01';
  const testTimestamp = new Date(testDate).getTime();
  const testAuthor = 'ozaki';

  async function readData(
    filePath: string,
    options: Parameters<typeof readLastUpdateData>[1],
    lastUpdateFrontMatter: Parameters<typeof readLastUpdateData>[2],
  ) {
    return readLastUpdateData(
      filePath,
      options,
      lastUpdateFrontMatter,
      DEFAULT_TEST_VCS_CONFIG,
    );
  }

  describe('on untracked Git file', () => {
    function readUntrackedFile(
      lastUpdateFrontMatter: FrontMatterLastUpdate | undefined,
    ) {
      return readData(
        DEFAULT_TEST_VCS_CONFIG.UNTRACKED_FILE_PATH,
        {showLastUpdateAuthor: true, showLastUpdateTime: true},
        lastUpdateFrontMatter,
      );
    }

    it('reads null at/by from Git', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await readUntrackedFile({});
      expect(lastUpdatedAt).toBeNull();
      expect(lastUpdatedBy).toBeNull();
    });

    it('reads null at from Git and author from front matter', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await readUntrackedFile({
        author: testAuthor,
      });
      expect(lastUpdatedAt).toBeNull();
      expect(lastUpdatedBy).toEqual(testAuthor);
    });

    it('reads null by from Git and date from front matter', async () => {
      const {lastUpdatedAt, lastUpdatedBy} = await readUntrackedFile({
        date: testDate,
      });
      expect(lastUpdatedBy).toBeNull();
      expect(lastUpdatedAt).toEqual(testTimestamp);
    });
  });

  it('read last time show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {date: testDate},
    );
    expect(lastUpdatedAt).toEqual(testTimestamp);
    expect(lastUpdatedBy).toBe(DEFAULT_TEST_VCS_CONFIG.LAST_UPDATE_INFO.author);
  });

  it('read last author show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toBe(
      DEFAULT_TEST_VCS_CONFIG.LAST_UPDATE_INFO.timestamp,
    );
  });

  it('read last all show author time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: true},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last default show none', async () => {
    const lastUpdate = await readData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: false},
      {},
    );
    expect(lastUpdate).toEqual({});
  });

  it('read last author show none', async () => {
    const lastUpdate = await readData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: false},
      {author: testAuthor},
    );
    expect(lastUpdate).toEqual({});
  });

  it('read last time show author', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {date: testDate},
    );
    expect(lastUpdatedBy).toBe(DEFAULT_TEST_VCS_CONFIG.LAST_UPDATE_INFO.author);
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last author show author', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toBe('ozaki');
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last default show author default', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {},
    );
    expect(lastUpdatedBy).toBe(DEFAULT_TEST_VCS_CONFIG.LAST_UPDATE_INFO.author);
    expect(lastUpdatedAt).toBeUndefined();
  });

  it('read last time show time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {date: testDate},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last author show time', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {author: testAuthor},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(
      DEFAULT_TEST_VCS_CONFIG.LAST_UPDATE_INFO.timestamp,
    );
  });

  it('read last author show time only - both front matter', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: false, showLastUpdateTime: true},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toBeUndefined();
    expect(lastUpdatedAt).toEqual(testTimestamp);
  });

  it('read last author show author only - both front matter', async () => {
    const {lastUpdatedAt, lastUpdatedBy} = await readData(
      '',
      {showLastUpdateAuthor: true, showLastUpdateTime: false},
      {author: testAuthor, date: testDate},
    );
    expect(lastUpdatedBy).toEqual(testAuthor);
    expect(lastUpdatedAt).toBeUndefined();
  });
});
