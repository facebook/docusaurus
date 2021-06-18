/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginContext, UserPluginOptions} from '../types';
import collectRedirects from '../collectRedirects';
import normalizePluginOptions from '../normalizePluginOptions';
import {removeTrailingSlash} from '@docusaurus/utils';

function createTestPluginContext(
  options?: UserPluginOptions,
  relativeRoutesPaths: string[] = [],
): PluginContext {
  return {
    outDir: '/tmp',
    baseUrl: 'https://docusaurus.io',
    relativeRoutesPaths,
    options: normalizePluginOptions(options),
  };
}

describe('collectRedirects', () => {
  test('should collect no redirect for undefined config', () => {
    expect(
      collectRedirects(
        createTestPluginContext(undefined, ['/', '/path']),
        undefined,
      ),
    ).toEqual([]);
  });

  test('should collect no redirect for empty config', () => {
    expect(collectRedirects(createTestPluginContext({}), undefined)).toEqual(
      [],
    );
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
        undefined,
      ),
    ).toEqual([
      {
        from: '/somePath.html',
        to: '/somePath',
      },
      {
        from: '/somePath.exe',
        to: '/somePath',
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
        undefined,
      ),
    ).toEqual([
      {
        from: '/otherPath',
        to: '/otherPath.html',
      },
    ]);
  });

  test('should collect redirects from plugin option redirects', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            redirects: [
              {
                from: '/someLegacyPath',
                to: '/somePath',
              },
              {
                from: ['/someLegacyPathArray1', '/someLegacyPathArray2'],
                to: '/',
              },
            ],
          },
          ['/', '/somePath'],
        ),
        undefined,
      ),
    ).toEqual([
      {
        from: '/someLegacyPath',
        to: '/somePath',
      },
      {
        from: '/someLegacyPathArray1',
        to: '/',
      },
      {
        from: '/someLegacyPathArray2',
        to: '/',
      },
    ]);
  });

  test('should collect redirects from plugin option redirects with trailingSlash=true', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            redirects: [
              {
                from: '/someLegacyPath',
                to: '/somePath',
              },
              {
                from: ['/someLegacyPathArray1', '/someLegacyPathArray2'],
                to: '/',
              },
            ],
          },
          ['/', '/somePath/'],
        ),
        true,
      ),
    ).toEqual([
      {
        from: '/someLegacyPath',
        to: '/somePath/',
      },
      {
        from: '/someLegacyPathArray1',
        to: '/',
      },
      {
        from: '/someLegacyPathArray2',
        to: '/',
      },
    ]);
  });

  test('should collect redirects from plugin option redirects with trailingSlash=false', () => {
    expect(
      collectRedirects(
        createTestPluginContext(
          {
            redirects: [
              {
                from: '/someLegacyPath',
                to: '/somePath/',
              },
              {
                from: ['/someLegacyPathArray1', '/someLegacyPathArray2'],
                to: '/',
              },
            ],
          },
          ['/', '/somePath'],
        ),
        false,
      ),
    ).toEqual([
      {
        from: '/someLegacyPath',
        to: '/somePath',
      },
      {
        from: '/someLegacyPathArray1',
        to: '/',
      },
      {
        from: '/someLegacyPathArray2',
        to: '/',
      },
    ]);
  });

  test('should throw if plugin option redirects contain invalid to paths', () => {
    expect(() =>
      collectRedirects(
        createTestPluginContext(
          {
            redirects: [
              {
                from: '/someLegacyPath',
                to: '/',
              },
              {
                from: '/someLegacyPath',
                to: '/this/path/does/not/exist2',
              },
              {
                from: '/someLegacyPath',
                to: '/this/path/does/not/exist2',
              },
            ],
          },
          ['/', '/someExistingPath', '/anotherExistingPath'],
        ),
        undefined,
      ),
    ).toThrowErrorMatchingSnapshot();
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
        undefined,
      ),
    ).toEqual([
      {
        from: '/some/path/suffix1',
        to: '/',
      },
      {
        from: '/some/other/path/suffix2',
        to: '/',
      },

      {
        from: '/testpath/some/path/suffix1',
        to: '/testpath',
      },
      {
        from: '/testpath/some/other/path/suffix2',
        to: '/testpath',
      },

      {
        from: '/otherPath.html/some/path/suffix1',
        to: '/otherPath.html',
      },
      {
        from: '/otherPath.html/some/other/path/suffix2',
        to: '/otherPath.html',
      },
    ]);
  });

  test('should throw if redirect creator creates invalid redirects', () => {
    expect(() =>
      collectRedirects(
        createTestPluginContext(
          {
            createRedirects: (routePath) => {
              if (routePath === '/') {
                return [
                  `https://google.com/`,
                  `//abc`,
                  `/def?queryString=toto`,
                ];
              }
              return undefined;
            },
          },
          ['/'],
        ),
        undefined,
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  test('should throw if redirect creator creates array of array redirect', () => {
    expect(() =>
      collectRedirects(
        createTestPluginContext(
          {
            createRedirects: (routePath) => {
              if (routePath === '/') {
                return ([[`/fromPath`]] as unknown) as string;
              }
              return undefined;
            },
          },
          ['/'],
        ),
        undefined,
      ),
    ).toThrowErrorMatchingSnapshot();
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
        undefined,
      ),
    ).toEqual([
      {
        from: '/toShouldWork.html',
        to: '/toShouldWork',
      },
      {
        from: '/toShouldWork.exe',
        to: '/toShouldWork',
      },
      {
        from: '/fromShouldWork',
        to: '/fromShouldWork.html',
      },
    ]);
  });
});
