/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  getAllDuplicateRoutes,
  getDuplicateRoutesMessage,
  handleDuplicateRoutes,
} from '../duplicateRoutes';
import {RouteConfig} from '@docusaurus/types';

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
    expect(getAllDuplicateRoutes(routes)).toMatchSnapshot();
  });

  test('handleDuplicateRoutes', () => {
    expect(() => {
      handleDuplicateRoutes(routes, 'throw');
    }).toThrowErrorMatchingSnapshot();
  });
});
