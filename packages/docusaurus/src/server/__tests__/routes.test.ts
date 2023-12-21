/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {loadRoutes, handleDuplicateRoutes, genChunkName} from '../routes';
import type {RouteConfig} from '@docusaurus/types';

describe('genChunkName', () => {
  it('works', () => {
    const firstAssert: {[key: string]: string} = {
      '/docs/adding-blog': 'docs-adding-blog-062',
      '/docs/versioning': 'docs-versioning-8a8',
      '/': 'index',
      '/blog/2018/04/30/How-I-Converted-Profilo-To-Docusaurus':
        'blog-2018-04-30-how-i-converted-profilo-to-docusaurus-4f2',
      '/youtube': 'youtube-429',
      '/users/en/': 'users-en-f7a',
      '/blog': 'blog-c06',
    };
    Object.keys(firstAssert).forEach((str) => {
      expect(genChunkName(str)).toBe(firstAssert[str]);
    });
  });

  it("doesn't allow different chunk name for same path", () => {
    expect(genChunkName('path/is/similar', 'oldPrefix')).toEqual(
      genChunkName('path/is/similar', 'newPrefix'),
    );
  });

  it('emits different chunk names for different paths even with same preferred name', () => {
    const secondAssert: {[key: string]: string} = {
      '/blog/1': 'blog-85-f-089',
      '/blog/2': 'blog-353-489',
    };
    Object.keys(secondAssert).forEach((str) => {
      expect(genChunkName(str, undefined, 'blog')).toBe(secondAssert[str]);
    });
  });

  it('only generates short unique IDs', () => {
    const thirdAssert: {[key: string]: string} = {
      a: '0cc175b9',
      b: '92eb5ffe',
      c: '4a8a08f0',
      d: '8277e091',
    };
    Object.keys(thirdAssert).forEach((str) => {
      expect(genChunkName(str, undefined, undefined, true)).toBe(
        thirdAssert[str],
      );
    });
    expect(genChunkName('d', undefined, undefined, true)).toBe('8277e091');
  });

  // https://github.com/facebook/docusaurus/issues/8536
  it('avoids hash collisions', () => {
    expect(
      genChunkName(
        '@site/blog/2022-11-18-bye-medium/index.mdx?truncated=true',
        'content',
        'blog',
        false,
      ),
    ).not.toBe(
      genChunkName(
        '@site/blog/2019-10-05-react-nfc/index.mdx?truncated=true',
        'content',
        'blog',
        false,
      ),
    );
    expect(
      genChunkName(
        '@site/blog/2022-11-18-bye-medium/index.mdx?truncated=true',
        'content',
        'blog',
        true,
      ),
    ).not.toBe(
      genChunkName(
        '@site/blog/2019-10-05-react-nfc/index.mdx?truncated=true',
        'content',
        'blog',
        true,
      ),
    );
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
    }).toThrowErrorMatchingSnapshot();
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleDuplicateRoutes(routes, 'ignore');
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });
});

describe('loadRoutes', () => {
  it('loads nested route config', () => {
    const nestedRouteConfig: RouteConfig = {
      component: '@theme/DocRoot',
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
          context: {
            plugin: 'pluginRouteContextModule-100.json',
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
          context: {
            plugin: 'pluginRouteContextModule-100.json',
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
    expect(loadRoutes([nestedRouteConfig], '/', 'ignore')).toMatchSnapshot();
  });

  it('loads flat route config', () => {
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
          },
          {
            content: {
              __import: true,
              path: 'blog/2018-12-14-Happy-First-Birthday-Slash.md',
            },
          },
        ],
      },
    };
    expect(loadRoutes([flatRouteConfig], '/', 'ignore')).toMatchSnapshot();
  });

  it('rejects invalid route config', () => {
    const routeConfigWithoutPath = {
      component: 'hello/world.js',
    } as RouteConfig;

    expect(() => loadRoutes([routeConfigWithoutPath], '/', 'ignore'))
      .toThrowErrorMatchingInlineSnapshot(`
      "Invalid route config: path must be a string and component is required.
      {"component":"hello/world.js"}"
    `);

    const routeConfigWithoutComponent = {
      path: '/hello/world',
    } as RouteConfig;

    expect(() => loadRoutes([routeConfigWithoutComponent], '/', 'ignore'))
      .toThrowErrorMatchingInlineSnapshot(`
      "Invalid route config: path must be a string and component is required.
      {"path":"/hello/world"}"
    `);
  });

  it('loads route config with empty (but valid) path string', () => {
    const routeConfig = {
      path: '',
      component: 'hello/world.js',
    } as RouteConfig;

    expect(loadRoutes([routeConfig], '/', 'ignore')).toMatchSnapshot();
  });
});
