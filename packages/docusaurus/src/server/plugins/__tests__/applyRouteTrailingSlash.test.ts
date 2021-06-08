/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import applyRouteTrailingSlash from '../applyRouteTrailingSlash';
import {RouteConfig} from '@docusaurus/types';

function route(path: string, subRoutes?: string[]): RouteConfig {
  const result: RouteConfig = {path, component: 'any'};

  if (subRoutes) {
    result.routes = subRoutes.map((subRoute) => route(subRoute));
  }

  return result;
}

describe('applyRouteTrailingSlash', () => {
  test('apply to empty', () => {
    expect(applyRouteTrailingSlash(route(''), true)).toEqual(route('/'));
    expect(applyRouteTrailingSlash(route(''), false)).toEqual(route(''));
    expect(applyRouteTrailingSlash(route(''), undefined)).toEqual(route(''));
  });

  test('apply to /', () => {
    expect(applyRouteTrailingSlash(route('/'), true)).toEqual(route('/'));
    expect(applyRouteTrailingSlash(route('/'), false)).toEqual(route('/'));
    expect(applyRouteTrailingSlash(route('/'), undefined)).toEqual(route('/'));
  });

  test('apply to /abc', () => {
    expect(applyRouteTrailingSlash(route('/abc'), true)).toEqual(
      route('/abc/'),
    );
    expect(applyRouteTrailingSlash(route('/abc'), false)).toEqual(
      route('/abc'),
    );
    expect(applyRouteTrailingSlash(route('/abc'), undefined)).toEqual(
      route('/abc'),
    );
  });

  test('apply to /abc/', () => {
    expect(applyRouteTrailingSlash(route('/abc/'), true)).toEqual(
      route('/abc/'),
    );
    expect(applyRouteTrailingSlash(route('/abc/'), false)).toEqual(
      route('/abc'),
    );
    expect(applyRouteTrailingSlash(route('/abc/'), undefined)).toEqual(
      route('/abc/'),
    );
  });

  test('apply to /abc?search#anchor', () => {
    expect(applyRouteTrailingSlash(route('/abc?search#anchor'), true)).toEqual(
      route('/abc/?search#anchor'),
    );
    expect(applyRouteTrailingSlash(route('/abc?search#anchor'), false)).toEqual(
      route('/abc?search#anchor'),
    );
    expect(
      applyRouteTrailingSlash(route('/abc?search#anchor'), undefined),
    ).toEqual(route('/abc?search#anchor'));
  });

  test('apply to /abc/?search#anchor', () => {
    expect(applyRouteTrailingSlash(route('/abc/?search#anchor'), true)).toEqual(
      route('/abc/?search#anchor'),
    );
    expect(
      applyRouteTrailingSlash(route('/abc/?search#anchor'), false),
    ).toEqual(route('/abc?search#anchor'));
    expect(
      applyRouteTrailingSlash(route('/abc/?search#anchor'), undefined),
    ).toEqual(route('/abc/?search#anchor'));
  });

  test('apply to subroutes', () => {
    expect(
      applyRouteTrailingSlash(route('/abc', ['/abc/1', '/abc/2']), true),
    ).toEqual(route('/abc/', ['/abc/1/', '/abc/2/']));
    expect(
      applyRouteTrailingSlash(route('/abc', ['/abc/1', '/abc/2']), false),
    ).toEqual(route('/abc', ['/abc/1', '/abc/2']));
    expect(
      applyRouteTrailingSlash(route('/abc', ['/abc/1', '/abc/2']), undefined),
    ).toEqual(route('/abc', ['/abc/1', '/abc/2']));
  });

  test('apply for complex case', () => {
    expect(
      applyRouteTrailingSlash(
        route('/abc?search#anchor', ['/abc/1?search', '/abc/2#anchor']),
        true,
      ),
    ).toEqual(
      route('/abc/?search#anchor', ['/abc/1/?search', '/abc/2/#anchor']),
    );
  });
});
