/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {hashString, simpleHash, docuHash} from '../hashUtils';

describe('hashUtils', () => {
  it('simpleHash', () => {
    const asserts: {[key: string]: string} = {
      '': 'e3b',
      '/foo-bar': 'f2b',
      '/foo/bar': 'a05',
      '/endi/lie': 'aec',
      '/endi-lie': '11d',
      '/yangshun/tay': '3f1',
      '/yangshun-tay': '81e',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar':
        'dbb',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/test1-test2':
        '255',
    };
    Object.keys(asserts).forEach((str) => {
      expect(simpleHash(str, 3)).toBe(asserts[str]);
    });
  });
});

describe('docuHash', () => {
  it('docuHash works', () => {
    const asserts: {[key: string]: string} = {
      '': '-e3b',
      '/': 'index',
      '/foo-bar': 'foo-bar-f2b',
      '/foo/bar': 'foo-bar-a05',
      '/endi/lie': 'endi-lie-aec',
      '/endi-lie': 'endi-lie-11d',
      '/yangshun/tay': 'yangshun-tay-3f1',
      '/yangshun-tay': 'yangshun-tay-81e',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo--dbb',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/test1-test2':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test--255',
    };
    Object.keys(asserts).forEach((file) => {
      expect(docuHash(file)).toBe(asserts[file]);
    });
  });

  it('docuHash works with hashLength option', () => {
    const asserts: {[key: string]: string} = {
      '': '-e3b0c',
      '/': 'index',
      '/foo-bar': 'foo-bar-f2b7d',
      '/foo/bar': 'foo-bar-a05d9',
    };
    Object.keys(asserts).forEach((file) => {
      expect(docuHash(file, {hashLength: 5})).toBe(asserts[file]);
    });
  });

  it('docuHash works with hashExtra option', () => {
    expect(docuHash('')).toBe('-e3b');
    expect(docuHash('', {hashExtra: ''})).toBe('-e3b');
    expect(docuHash('', {hashExtra: 'some-extra'})).toBe('-696');

    expect(docuHash('/')).toBe('index');
    expect(docuHash('/', {hashExtra: ''})).toBe('index-1bc');
    expect(docuHash('/', {hashExtra: 'some-extra'})).toBe('index-961');

    expect(docuHash('/foo/bar')).toBe('foo-bar-a05');
    expect(docuHash('/foo/bar', {hashExtra: ''})).toBe('foo-bar-a05');
    expect(docuHash('/foo/bar', {hashExtra: 'some-extra'})).toBe('foo-bar-c4d');
  });
});

describe('hashString', () => {
  it('uses SHA-256', () => {
    expect(hashString('/foo/bar')).toBe(
      'a05d96ad6bf8f3eaa59689160625f69dd411591f9dbdc728baad8c1c75af9ad6',
    );
  });
});
