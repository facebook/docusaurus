/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  getAllDuplicateRoutes,
  getDuplicateRoutesMessage,
} from '../duplicateRoutes';
import {RouteConfig} from '@docusaurus/types';

describe('duplicateRoutes', () => {
  test('getDuplicateRoutesMessage', () => {
    const message = getDuplicateRoutesMessage([
      '/',
      '/',
      '/blog',
      '/doc/search',
    ]);
    expect(message).toMatchSnapshot();
  });

  test('getAllDuplicateRoutes', () => {
    const routes: RouteConfig[] = [
      {
        path: '/',
        component: '',
        routes: [
          {path: '/search', component: ''},
          {path: '/sameDoc', component: ''},
        ],
      },
      {
        path: '/',
        component: '',
        routes: [
          {path: '/search', component: ''},
          {path: '/sameDoc', component: ''},
          {path: '/uniqueDoc', component: ''},
        ],
      },
    ];
    expect(getAllDuplicateRoutes(routes)).toMatchSnapshot();
  });
});
