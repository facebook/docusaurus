/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';

import lastUpdate from '../lastUpdate';
import {SpawnSyncReturns} from 'child_process';

describe('lastUpdate', () => {
  test('existing test file in repository with Git timestamp', () => {
    const existingFilePath = path.join(
      __dirname,
      '__fixtures__/website/docs/hello.md',
    );
    const lastUpdateData = lastUpdate(existingFilePath);
    expect(lastUpdateData).not.toBeNull();

    const {author, timestamp} = lastUpdateData;
    expect(author).not.toBeNull();
    expect(typeof author).toBe('string');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
  });

  test('non-existing file', () => {
    const nonExistingFilePath = path.join(
      __dirname,
      '__fixtures__',
      '.nonExisting',
    );
    expect(lastUpdate(null)).toBeNull();
    expect(lastUpdate(undefined)).toBeNull();
    expect(lastUpdate(nonExistingFilePath)).toBeNull();
  });

  test('temporary created file that has no git timestamp', () => {
    const tempFilePath = path.join(__dirname, '__fixtures__', '.temp');
    fs.writeFileSync(tempFilePath, 'Lorem ipsum :)');
    expect(lastUpdate(tempFilePath)).toBeNull();
    fs.unlinkSync(tempFilePath);
  });
});
