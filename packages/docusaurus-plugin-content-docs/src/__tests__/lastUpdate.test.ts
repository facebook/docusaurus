/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import lastUpdate from '../lastUpdate';

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

  test('test renaming and moving file', () => {
    const mock = jest.spyOn(shell, 'exec');
    mock
      .mockImplementationOnce(() => ({
        stdout:
          '1539502055, Yangshun Tay\n' +
          '\n' +
          ' create mode 100644 v1/lib/core/__tests__/__fixtures__/.temp2\n',
      }))
      .mockImplementationOnce(() => ({
        stdout:
          '1539502056, Joel Marcey\n' +
          '\n' +
          ' rename v1/lib/core/__tests__/__fixtures__/{.temp2 => test/.temp3} (100%)\n' +
          '1539502055, Yangshun Tay\n' +
          '\n' +
          ' create mode 100644 v1/lib/core/__tests__/__fixtures__/.temp2\n',
      }));
    const tempFilePath2 = path.join(__dirname, '__fixtures__', '.temp2');
    const tempFilePath3 = path.join(
      __dirname,
      '__fixtures__',
      'test',
      '.temp3',
    );

    // Create new file.
    const createData = lastUpdate(tempFilePath2);
    expect(createData.timestamp).not.toBeNull();

    // Rename/move the file.
    const updateData = lastUpdate(tempFilePath3);
    expect(updateData.timestamp).not.toBeNull();
    // Should only consider file content change.
    expect(updateData.timestamp).toEqual(createData.timestamp);

    mock.mockRestore();
  });
});
