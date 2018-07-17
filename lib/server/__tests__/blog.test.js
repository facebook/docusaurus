/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const fs = require('fs-extra');
const blog = require('../blog');

const testFile = path.join(
  __dirname,
  '__fixtures__',
  '2018-08-17-docusaurus.md'
);

fs.existsSync = jest.fn().mockReturnValue(true);

describe('getMetadata', () => {
  test('file does not exist', () => {
    fs.existsSync.mockReturnValueOnce(null);
    expect(blog.getMetadata('/this/path/does-not-exist/')).toBeNull();
  });

  test('null/undefined', () => {
    expect(blog.getMetadata(null)).toBeNull();
    expect(blog.getMetadata(undefined)).toBeNull();
  });

  test('blog file', () => {
    const metadata = blog.getMetadata(testFile);
    expect(metadata).toMatchSnapshot();
    expect(metadata).not.toBeNull();
    expect(metadata).toHaveProperty('id');
    expect(metadata).toHaveProperty('path');
    expect(metadata).toHaveProperty('content');
  });
});

describe('fileToUrl', () => {
  test('invalid file path', () => {
    expect(blog.fileToUrl(null)).toBeNull();
    expect(blog.fileToUrl(undefined)).toBeNull();
    expect(blog.fileToUrl(true)).toBeNull();
    fs.existsSync.mockReturnValueOnce(null);
    expect(blog.fileToUrl('2018-03-02-this-does-not-exist.md')).toBeNull();
  });

  test('valid filepath', () => {
    expect(blog.fileToUrl(testFile)).toEqual('2018/08/17/docusaurus.html');
  });
});

describe('urlToSource', () => {
  test('invalid url path', () => {
    expect(blog.urlToSource(null)).toBeNull();
    expect(blog.urlToSource(undefined)).toBeNull();
    expect(blog.urlToSource(true)).toBeNull();
  });
  test('valid url path', () => {
    expect(blog.urlToSource(`${blog.fileToUrl(testFile)}`)).toEqual(
      '2018-08-17-docusaurus.md'
    );
    expect(blog.urlToSource('2018/03/04/test-name-lol.html')).toEqual(
      '2018-03-04-test-name-lol.md'
    );
  });
});
