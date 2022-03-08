/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {handleDuplicateRoutes} from '../duplicateRoutes';
import type {RouteConfig} from '@docusaurus/types';

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
  {
    path: '/',
    component: '',
  },
  {
    path: '/',
    component: '',
  },
  {
    path: '/',
    component: '',
  },
];

test('handleDuplicateRoutes', () => {
  expect(() => {
    handleDuplicateRoutes(routes, 'throw');
  }).toThrowErrorMatchingSnapshot();
  const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleDuplicateRoutes(routes, 'ignore');
  expect(consoleMock).toBeCalledTimes(0);
});
