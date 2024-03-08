/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {getAllFinalRoutes, handleDuplicateRoutes} from '../routes';
import type {RouteConfig} from '@docusaurus/types';

describe('getAllFinalRoutes', () => {
  it('gets final routes correctly', () => {
    const routes: RouteConfig[] = [
      {
        path: '/docs',
        component: '',
        routes: [
          {path: '/docs/someDoc', component: ''},
          {path: '/docs/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/community',
        component: '',
      },
    ];
    expect(getAllFinalRoutes(routes)).toEqual([
      routes[0]!.routes![0],
      routes[0]!.routes![1],
      routes[1],
    ]);
  });
});

describe('handleDuplicateRoutes', () => {
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
  it('works', () => {
    expect(() => {
      handleDuplicateRoutes(routes, 'throw');
    }).toThrowErrorMatchingInlineSnapshot(`
      "Duplicate routes found!
      - Attempting to create page at /search, but a page already exists at this route.
      - Attempting to create page at /sameDoc, but a page already exists at this route.
      - Attempting to create page at /, but a page already exists at this route.
      - Attempting to create page at /, but a page already exists at this route.
      This could lead to non-deterministic routing behavior."
    `);
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleDuplicateRoutes(routes, 'ignore');
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });
});
