/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {packageManagerScriptCommand, siteNameToPackageName} from '../utils';

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

describe('packageManagerScriptCommand', () => {
  it('adds "run" to every nub script (nub has no implicit shortcut)', () => {
    expect(packageManagerScriptCommand('nub', 'start')).toBe('nub run start');
    expect(packageManagerScriptCommand('nub', 'build')).toBe('nub run build');
  });

  it('keeps "start" bare for npm/bun but adds "run" to other scripts', () => {
    expect(packageManagerScriptCommand('npm', 'start')).toBe('npm start');
    expect(packageManagerScriptCommand('npm', 'build')).toBe('npm run build');
    expect(packageManagerScriptCommand('bun', 'start')).toBe('bun start');
    expect(packageManagerScriptCommand('bun', 'build')).toBe('bun run build');
  });

  it('never adds "run" for yarn/pnpm', () => {
    expect(packageManagerScriptCommand('yarn', 'start')).toBe('yarn start');
    expect(packageManagerScriptCommand('pnpm', 'build')).toBe('pnpm build');
  });
});
