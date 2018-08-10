import path from 'path';
import {fileToPath, fileToComponentName} from '@lib/load/utils.js';

describe('load utils', () => {
  test('fileToComponentName', () => {
    const asserts = {
      'index.md': 'MDIndex',
      'hello/index.md': 'MDHelloIndex',
      'foo.md': 'MDFoo',
      'foo-bar.md': 'MDFooBar',
      'index.js': 'JSIndex',
      'foobar.js': 'JSFoobar',
      'docusaurus/index.js': 'JSDocusaurusIndex',
      '234.md': 'MD234',
      '2018-07-08-test.md': 'MD20180708Test',
      '%asd.md': 'MDAsd'
    };
    Object.keys(asserts).forEach(file => {
      expect(fileToComponentName(file)).toBe(asserts[file]);
    });
  });

  test('fileToPath', () => {
    const asserts = {
      'index.md': '/',
      'hello/index.md': '/hello/',
      'foo.md': '/foo',
      'foo/bar.md': '/foo/bar',
      'index.js': '/',
      'hello/index.js': '/hello/',
      'foo.js': '/foo',
      'foo/bar.js': '/foo/bar'
    };
    Object.keys(asserts).forEach(file => {
      expect(fileToPath(file)).toBe(asserts[file]);
    });
  });
});
