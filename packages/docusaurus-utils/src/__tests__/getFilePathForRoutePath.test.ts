/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFilePathForRoutePath} from '../getFilePathForRoutePath';
import {posixPath} from '../posixPath';

describe('getFilePathForRoutePath trailingSlash=undefined', () => {
  test('works for /', () => {
    expect(posixPath(getFilePathForRoutePath('/', undefined))).toEqual(
      '/index.html',
    );
  });

  test('works for /somePath', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath', undefined))).toEqual(
      '/somePath/index.html',
    );
  });

  test('works for /somePath/', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath/', undefined))).toEqual(
      '/somePath/index.html',
    );
  });

  test('works for /somePath/xyz.html', () => {
    expect(
      posixPath(getFilePathForRoutePath('/somePath/xyz.html', undefined)),
    ).toEqual('/somePath/xyz.html');
  });
});

describe('getFilePathForRoutePath trailingSlash=true', () => {
  test('works for /', () => {
    expect(posixPath(getFilePathForRoutePath('/', true))).toEqual(
      '/index.html',
    );
  });

  test('works for /somePath', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath', true))).toEqual(
      '/somePath/index.html',
    );
  });

  test('works for /somePath/', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath/', true))).toEqual(
      '/somePath/index.html',
    );
  });

  test('works for /somePath/xyz.html', () => {
    expect(
      posixPath(getFilePathForRoutePath('/somePath/xyz.html', true)),
    ).toEqual('/somePath/xyz.html');
  });
});

describe('getFilePathForRoutePath trailingSlash=false', () => {
  test('works for /', () => {
    expect(posixPath(getFilePathForRoutePath('/', false))).toEqual(
      '/index.html',
    );
  });

  test('works for /somePath', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath', false))).toEqual(
      '/somePath.html',
    );
  });

  test('works for /somePath/', () => {
    expect(posixPath(getFilePathForRoutePath('/somePath/', false))).toEqual(
      '/somePath/index.html',
    );
  });

  test('works for /somePath/xyz.html', () => {
    expect(
      posixPath(getFilePathForRoutePath('/somePath/xyz.html', false)),
    ).toEqual('/somePath/xyz.html');
  });
});
