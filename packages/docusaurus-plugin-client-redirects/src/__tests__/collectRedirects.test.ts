/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginContext, UserPluginOptions} from '../types';
import collectRedirects from '../collectRedirects';
import normalizePluginOptions from '../normalizePluginOptions';
import {removeTrailingSlash} from '../utils';

function createTestPluginContext(
  options?: UserPluginOptions,
  routesPaths: string[] = [],
): PluginContext {
  return {
    outDir: '/tmp',
    baseUrl: 'https://docusaurus.io',
    routesPaths: routesPaths,
    options: normalizePluginOptions(options),
  };
}

describe('collectRedirects', () => {
  test('should collect no redirect for undefined config', () => {
    expect(
      collectRedirects(createTestPluginContext(undefined, ['/', '/path'])),
    ).toEqual([]);
  });

  test('should collect no redirect for empty config', () => {
    expect(collectRedirects(createTestPluginContext({}))).toEqual([]);
  });

  test('should collect redirects to html/exe extension', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            fromExtensions: ['html', 'exe'],
          },
          ['/', '/somePath', '/otherPath.html'],
        ),
      ),
    ).toEqual([
      {
        fromRoutePath: '/somePath.html',
        toRoutePath: '/somePath',
      },
      {
        fromRoutePath: '/somePath.exe',
        toRoutePath: '/somePath',
      },
    ]);
  });

  test('should collect redirects to html/exe extension', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            toExtensions: ['html', 'exe'],
          },
          ['/', '/somePath', '/otherPath.html'],
        ),
      ),
    ).toEqual([
      {
        fromRoutePath: '/otherPath',
        toRoutePath: '/otherPath.html',
      },
    ]);
  });

  test('should collect redirects with custom redirect creator', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            createRedirects: (routePath) => {
              return [
                `${removeTrailingSlash(routePath)}/some/path/suffix1`,
                `${removeTrailingSlash(routePath)}/some/other/path/suffix2`,
              ];
            },
          },
          ['/', '/testpath', '/otherPath.html'],
        ),
      ),
    ).toEqual([
      {
        fromRoutePath: '/some/path/suffix1',
        toRoutePath: '/',
      },
      {
        fromRoutePath: '/some/other/path/suffix2',
        toRoutePath: '/',
      },

      {
        fromRoutePath: '/testpath/some/path/suffix1',
        toRoutePath: '/testpath',
      },
      {
        fromRoutePath: '/testpath/some/other/path/suffix2',
        toRoutePath: '/testpath',
      },

      {
        fromRoutePath: '/otherPath.html/some/path/suffix1',
        toRoutePath: '/otherPath.html',
      },
      {
        fromRoutePath: '/otherPath.html/some/other/path/suffix2',
        toRoutePath: '/otherPath.html',
      },
    ]);
  });

  test('should filter unwanted redirects', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            fromExtensions: ['html', 'exe'],
            toExtensions: ['html', 'exe'],
          },
          [
            '/',
            '/somePath',
            '/somePath.html',
            '/somePath.exe',
            '/fromShouldWork.html',
            '/toShouldWork',
          ],
        ),
      ),
    ).toEqual([
      {
        fromRoutePath: '/toShouldWork.html',
        toRoutePath: '/toShouldWork',
      },
      {
        fromRoutePath: '/toShouldWork.exe',
        toRoutePath: '/toShouldWork',
      },
      {
        fromRoutePath: '/fromShouldWork',
        toRoutePath: '/fromShouldWork.html',
      },
    ]);
  });
});
