/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial} from '@total-typescript/shoehorn';
import {createSitemapItem} from '../createSitemapItem';
import {DEFAULT_OPTIONS} from '../options';
import type {PluginOptions} from '../options';
import type {DocusaurusConfig, RouteConfig} from '@docusaurus/types';

const siteConfig: DocusaurusConfig = fromPartial({
  url: 'https://example.com',
});

function test(params: {
  route: Partial<RouteConfig>;
  siteConfig?: Partial<DocusaurusConfig>;
  options?: Partial<PluginOptions>;
}) {
  return createSitemapItem({
    route: params.route as unknown as RouteConfig,
    siteConfig: {...siteConfig, ...params.siteConfig},
    options: {...DEFAULT_OPTIONS, ...params.options},
  });
}

function testRoute(route: Partial<RouteConfig>) {
  return test({
    route,
  });
}

describe('createSitemapItem', () => {
  it('simple item', async () => {
    await expect(testRoute({path: '/routePath'})).resolves
      .toMatchInlineSnapshot(`
      {
        "changefreq": "weekly",
        "lastmod": null,
        "priority": 0.5,
        "url": "https://example.com/routePath",
      }
    `);
  });

  describe('lastmod', () => {
    const date = new Date('2024/01/01');

    describe('read from route metadata', () => {
      const route = {
        path: '/routePath',
        metadata: {lastUpdatedAt: date.getTime()},
      };

      it('lastmod default option', async () => {
        await expect(
          test({
            route,
          }),
        ).resolves.toMatchInlineSnapshot(`
              {
                "changefreq": "weekly",
                "lastmod": null,
                "priority": 0.5,
                "url": "https://example.com/routePath",
              }
          `);
      });

      it('lastmod date option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'date',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
                  {
                    "changefreq": "weekly",
                    "lastmod": "2024-01-01",
                    "priority": 0.5,
                    "url": "https://example.com/routePath",
                  }
              `);
      });

      it('lastmod datetime option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'datetime',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
                  {
                    "changefreq": "weekly",
                    "lastmod": "2024-01-01T00:00:00.000Z",
                    "priority": 0.5,
                    "url": "https://example.com/routePath",
                  }
              `);
      });
    });

    describe('read from git', () => {
      const route = {
        path: '/routePath',
        metadata: {sourceFilePath: 'route/file.md'},
      };

      it('lastmod default option', async () => {
        await expect(
          test({
            route,
          }),
        ).resolves.toMatchInlineSnapshot(`
              {
                "changefreq": "weekly",
                "lastmod": null,
                "priority": 0.5,
                "url": "https://example.com/routePath",
              }
          `);
      });

      it('lastmod date option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'date',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
                  {
                    "changefreq": "weekly",
                    "lastmod": "2018-10-14",
                    "priority": 0.5,
                    "url": "https://example.com/routePath",
                  }
              `);
      });

      it('lastmod datetime option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'datetime',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
                  {
                    "changefreq": "weekly",
                    "lastmod": "2018-10-14T07:27:35.000Z",
                    "priority": 0.5,
                    "url": "https://example.com/routePath",
                  }
              `);
      });
    });

    describe('read from both - route metadata takes precedence', () => {
      const route = {
        path: '/routePath',
        metadata: {
          sourceFilePath: 'route/file.md',
          lastUpdatedAt: date.getTime(),
        },
      };

      it('lastmod default option', async () => {
        await expect(
          test({
            route,
          }),
        ).resolves.toMatchInlineSnapshot(`
              {
                "changefreq": "weekly",
                "lastmod": null,
                "priority": 0.5,
                "url": "https://example.com/routePath",
              }
          `);
      });

      it('lastmod date option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'date',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "changefreq": "weekly",
            "lastmod": "2024-01-01",
            "priority": 0.5,
            "url": "https://example.com/routePath",
          }
        `);
      });

      it('lastmod datetime option', async () => {
        await expect(
          test({
            route,
            options: {
              lastmod: 'datetime',
            },
          }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "changefreq": "weekly",
            "lastmod": "2024-01-01T00:00:00.000Z",
            "priority": 0.5,
            "url": "https://example.com/routePath",
          }
        `);
      });
    });
  });
});
