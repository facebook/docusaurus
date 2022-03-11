/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loadRoutes from '../routes';
import type {RouteConfig} from '@docusaurus/types';

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
        },
      ],
    };
    await expect(
      loadRoutes([nestedRouteConfig], '/'),
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
        ],
      },
    };
    await expect(loadRoutes([flatRouteConfig], '/')).resolves.toMatchSnapshot();
  });

  it('rejects invalid route config', async () => {
    const routeConfigWithoutPath = {
      component: 'hello/world.js',
    } as RouteConfig;

    await expect(loadRoutes([routeConfigWithoutPath], '/')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
            "Invalid route config: path must be a string and component is required.
            {\\"component\\":\\"hello/world.js\\"}"
          `);

    const routeConfigWithoutComponent = {
      path: '/hello/world',
    } as RouteConfig;

    await expect(loadRoutes([routeConfigWithoutComponent], '/')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
            "Invalid route config: path must be a string and component is required.
            {\\"path\\":\\"/hello/world\\"}"
          `);
  });

  it('loads route config with empty (but valid) path string', async () => {
    const routeConfig = {
      path: '',
      component: 'hello/world.js',
    } as RouteConfig;

    await expect(loadRoutes([routeConfig], '/')).resolves.toMatchSnapshot();
  });
});
