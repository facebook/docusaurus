/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {loadRoutes, handleDuplicateRoutes} from '../routes';
import type {RouteConfig} from '@docusaurus/types';

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
    }).toThrowErrorMatchingSnapshot();
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleDuplicateRoutes(routes, 'ignore');
    expect(consoleMock).toBeCalledTimes(0);
  });
});

describe('loadRoutes', () => {
  it('loads nested route config', async () => {
    const nestedRouteConfig: RouteConfig = {
      component: '@theme/DocPage',
      path: '/docs:route',
      modules: {
        docsMetadata: 'docs-b5f.json',
      },
      routes: [
        {
          path: '/docs/hello',
          component: '@theme/DocItem',
          exact: true,
          modules: {
            content: 'docs/hello.md',
            metadata: 'docs-hello-da2.json',
          },
          sidebar: 'main',
        },
        {
          path: 'docs/foo/baz',
          component: '@theme/DocItem',
          modules: {
            content: 'docs/foo/baz.md',
            metadata: 'docs-foo-baz-dd9.json',
          },
          sidebar: 'secondary',
          'key:a': 'containing colon',
          "key'b": 'containing quote',
          'key"c': 'containing double quote',
          'key,d': 'containing comma',
          字段: 'containing unicode',
        },
      ],
    };
    await expect(
      loadRoutes([nestedRouteConfig], '/', 'ignore'),
    ).resolves.toMatchSnapshot();
  });

  it('loads flat route config', async () => {
    const flatRouteConfig: RouteConfig = {
      path: '/blog',
      component: '@theme/BlogListPage',
      exact: true,
      modules: {
        items: [
          {
            content: {
              __import: true,
              path: 'blog/2018-12-14-Happy-First-Birthday-Slash.md',
              query: {
                truncated: true,
              },
            },
            metadata: 'blog-2018-12-14-happy-first-birthday-slash-d2c.json',
          },
          {
            content: 'blog/2018-12-14-Happy-First-Birthday-Slash.md',
            metadata: null,
          },
          {
            content: {
              __import: true,
              path: 'blog/2018-12-14-Happy-First-Birthday-Slash.md',
            },
            metadata: null,
          },
        ],
      },
    };
    await expect(
      loadRoutes([flatRouteConfig], '/', 'ignore'),
    ).resolves.toMatchSnapshot();
  });

  it('rejects invalid route config', async () => {
    const routeConfigWithoutPath = {
      component: 'hello/world.js',
    } as RouteConfig;

    await expect(loadRoutes([routeConfigWithoutPath], '/', 'ignore')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
            "Invalid route config: path must be a string and component is required.
            {\\"component\\":\\"hello/world.js\\"}"
          `);

    const routeConfigWithoutComponent = {
      path: '/hello/world',
    } as RouteConfig;

    await expect(loadRoutes([routeConfigWithoutComponent], '/', 'ignore'))
      .rejects.toThrowErrorMatchingInlineSnapshot(`
            "Invalid route config: path must be a string and component is required.
            {\\"path\\":\\"/hello/world\\"}"
          `);
  });

  it('loads route config with empty (but valid) path string', async () => {
    const routeConfig = {
      path: '',
      component: 'hello/world.js',
    } as RouteConfig;

    await expect(
      loadRoutes([routeConfig], '/', 'ignore'),
    ).resolves.toMatchSnapshot();
  });
});
