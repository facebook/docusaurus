/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {EventEmitter} from 'events';
import spawn from 'cross-spawn';
import {siteNameToPackageName, runCommand} from '../utils';

// MY TEST CASE

describe('siteNameToPackageName', () => {
  it('converts simple cases', () => {
    const testCases: [string, string][] = [
      ['Foo Bar', 'foo-bar'],
      ['fooBar', 'foo-bar'],
      ['__FOO_BAR__', 'foo-bar'],
      ['XMLHttpRequest', 'xml-http-request'],
      ['sitemapXML', 'sitemap-xml'],
      ['XMLHttp', 'xml-http'],
      ['xml-http', 'xml-http'],
    ];

    testCases.forEach(([input, expected]) => {
      expect(siteNameToPackageName(input)).toEqual(expected);
    });
  });

  it('converts ñ', () => {
    expect(siteNameToPackageName('mañanaFoo')).toEqual('ma-ana-foo');
  });

  it('converts __', () => {
    expect(siteNameToPackageName('foo__bar')).toEqual('foo-bar');
  });

  it('skips 🔥', () => {
    expect(siteNameToPackageName('🔥')).toEqual('🔥');
  });

  it('skips !!!', () => {
    expect(siteNameToPackageName('!!!')).toEqual('!!!');
  });
});

jest.mock('cross-spawn', () => {
  const mockFn = jest.fn();
  return {
    default: mockFn,
    __esModule: true,
  };
});

// describe.skip(........) skips my test cases to get coverage before
describe('runCommand error handling', () => {
  beforeEach(() => {
    // set spawn mock to a clean default state
    jest.mocked(spawn).mockImplementation(() => {
      const fakeProcess = new EventEmitter();
      process.nextTick(() => fakeProcess.emit('close', 0));
      return fakeProcess;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('verifies error thrown for empty string commands', async () => {
    await expect(runCommand('')).rejects.toThrow('Invalid command');
  });

  it('verifies error thrown for white spaces only command', async () => {
    await expect(runCommand('  ')).rejects.toThrow('Invalid command');
  });

  it('verifies promise rejects when spawn emits error event', async () => {
    jest.mocked(spawn).mockImplementation(() => {
      const fakeProcess = new EventEmitter();
      process.nextTick(() =>
        fakeProcess.emit('error', new Error('spawn failed')),
      );
      return fakeProcess;
    });
    await expect(runCommand('some-command')).rejects.toThrow('spawn failed');
  });

  it('promise rejects when exit code is null', async () => {
    jest.mocked(spawn).mockImplementation(() => {
      const fakeProcess = new EventEmitter();
      process.nextTick(() => fakeProcess.emit('close', null));
      return fakeProcess;
    });
    await expect(runCommand('some-command')).rejects.toThrow(
      'No exit code for command',
    );
  });
});
