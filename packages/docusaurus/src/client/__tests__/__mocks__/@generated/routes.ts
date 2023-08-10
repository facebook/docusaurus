/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default [
  {
    path: '/page.html',
    exact: true,
    component: '',
  },
  {
    path: '/docs',
    exact: false,
    component: '',
    routes: [
      {
        path: '/docs/installation',
        exact: true,
        component: '',
      },
    ],
  },
  // merge for sitemap test since duplicating __mocks__/@generated/routes.ts results in:
  // jest-haste-map: duplicate manual mock found: routes
  {
    path: '/test',
    exact: true,
    component: '',
    lastModified: '2023-08-01T00:00:00.000Z',
  },
  {
    path: '/404.html',
    exact: true,
    component: '',
    lastModified: '2023-08-02T00:00:00.000Z',
  },
  {
    path: '/my-page',
    exact: true,
    component: '',
    lastModified: '2023-08-03T00:00:00.000Z',
  },
  {
    path: '/noindex',
    exact: true,
    component: '',
    lastModified: '2023-08-04T00:00:00.000Z',
  },
  {
    path: '/search',
    exact: false,
    component: '',
    routes: [
      {
        path: '/search/',
        exact: true,
        component: '',
        lastModified: '2023-08-04T00:00:00.000Z',
      },
      {
        path: '/search/foo',
        exact: true,
        component: '',
        lastModified: '2023-08-06T00:00:00.000Z',
      },
    ],
  },
  {
    path: '/tags',
    exact: false,
    component: '',
    routes: [
      {
        path: '/tags/',
        exact: true,
        component: '',
        lastModified: '2023-08-07T00:00:00.000Z',
      },
      {
        path: '/tags/foo',
        exact: false,
        component: '',
        rotes: [
          {
            path: '/tags/foo/bar',
            exact: true,
            component: '',
            lastModified: '2023-08-08T00:00:00.000Z',
          },
        ],
      },
    ],
  },
  {
    path: '/nested',
    exact: false,
    component: '',
    routes: [
      {
        path: '/nested/test',
        exact: true,
        component: '',
        lastModified: '2023-08-09T00:00:00.000Z',
      },
      {
        path: '/nested/test2',
        exact: false,
        component: '',
        routes: [
          {
            path: '/nested/test2/',
            exact: true,
            component: '',
            lastModified: '2023-08-10T00:00:00.000Z',
          },
        ],
      },
    ],
  },
  // end merge
  {
    path: '*',
    component: '',
  },
];
