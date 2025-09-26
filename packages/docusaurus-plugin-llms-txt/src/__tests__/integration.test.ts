/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createLlmsTxt from '../createLlmsTxt';
import type {PluginOptions} from '@docusaurus/plugin-llms-txt';

describe('Integration test', () => {
  it('generates a realistic llms.txt file', async () => {
    // Simulate real Docusaurus site configuration
    const siteConfig = {
      title: 'Docusaurus',
      url: 'https://docusaurus.io',
      baseUrl: '/',
      tagline: 'Build optimized websites quickly, focus on your content',
    };

    // Simulate realistic routes that Docusaurus would generate
    const routes = [
      {
        path: '/',
        component: 'component---src-pages-index-tsx',
        exact: true,
      },
      {
        path: '/docs/',
        component: 'component---src-docs-index-tsx',
        exact: true,
      },
      {
        path: '/docs/getting-started',
        component: 'component---docs-getting-started-mdx',
        exact: true,
      },
      {
        path: '/docs/installation',
        component: 'component---docs-installation-mdx',
        exact: true,
      },
      {
        path: '/docs/configuration',
        component: 'component---docs-configuration-mdx',
        exact: true,
      },
      {
        path: '/docs/api/plugins',
        component: 'component---docs-api-plugins-mdx',
        exact: true,
      },
      {
        path: '/blog',
        component: 'component---src-blog-index-tsx',
        exact: true,
      },
      {
        path: '/blog/2024/01/15/announcing-docusaurus-3',
        component: 'component---blog-2024-01-15-announcing-docusaurus-3-mdx',
        exact: true,
      },
      {
        path: '/blog/2023/12/10/new-features',
        component: 'component---blog-2023-12-10-new-features-mdx',
        exact: true,
      },
      {
        path: '/community',
        component: 'component---src-pages-community-tsx',
        exact: true,
      },
      {
        path: '/showcase',
        component: 'component---src-pages-showcase-tsx',
        exact: true,
      },
      // This should be excluded (utility route)
      {
        path: '/404.html',
        component: 'component---src-pages-404-tsx',
        exact: true,
      },
      // This should be excluded (search page)
      {
        path: '/search',
        component: 'component---src-pages-search-tsx',
        exact: true,
      },
    ];

    const options: PluginOptions = {
      filename: 'llms.txt',
      siteTitle: 'Docusaurus Documentation',
      siteDescription:
        'Build optimized websites quickly, focus on your content. Learn how to get started with Docusaurus.',
      includeBlog: true,
      includeDocs: true,
      includePages: true,
      maxDepth: 3,
      excludeRoutes: [],
      includeFullContent: false,
      customContent:
        'Docusaurus is a modern static website generator that helps you build fast, SEO-friendly documentation websites. This site contains comprehensive guides, API references, and community resources.',
    };

    const result = await createLlmsTxt({
      siteConfig,
      routes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).toContain('# Docusaurus Documentation');
    expect(result).toContain(
      'Build optimized websites quickly, focus on your content. Learn how to get started with Docusaurus.',
    );
    expect(result).toContain('Site URL: https://docusaurus.io/');
    expect(result).toContain('Docusaurus is a modern static website generator');

    // Check that content is properly categorized
    expect(result).toContain('### Documentation');
    expect(result).toContain('### Blog Posts');
    expect(result).toContain('### Pages');

    // Check that specific pages are included
    expect(result).toContain(
      '[Getting Started](https://docusaurus.io/docs/getting-started)',
    );
    expect(result).toContain(
      '[Installation](https://docusaurus.io/docs/installation)',
    );
    expect(result).toContain(
      '[Plugins](https://docusaurus.io/docs/api/plugins)',
    );
    expect(result).toContain('[Community](https://docusaurus.io/community)');
    expect(result).toContain('[Showcase](https://docusaurus.io/showcase)');

    // Check that blog posts are included
    expect(result).toContain(
      '[Announcing Docusaurus 3](https://docusaurus.io/blog/2024/01/15/announcing-docusaurus-3)',
    );
    expect(result).toContain(
      '[New Features](https://docusaurus.io/blog/2023/12/10/new-features)',
    );

    // Check that utility routes are excluded
    expect(result).not.toContain('404.html');
    expect(result).not.toContain('/search');

    // Check last updated date is included
    expect(result).toContain('Last updated:');

    // Check that the format is correct
    const lines = result!.split('\n');
    expect(lines[0]).toBe('# Docusaurus Documentation');
    expect(lines[2]).toBe(
      'Build optimized websites quickly, focus on your content. Learn how to get started with Docusaurus.',
    );
    expect(lines[4]).toBe('Site URL: https://docusaurus.io/');

    // Verify the structure
    expect(result).toMatch(
      /# .+\n\n.+\n\nSite URL: .+\nLast updated: \d{4}-\d{2}-\d{2}\n\n.+\n\n## Content/,
    );
  });

  it('handles edge cases gracefully', async () => {
    const siteConfig = {
      title: 'Test Site',
      url: 'https://test.com',
      baseUrl: '/',
    };

    // Test with no valid routes
    const emptyRoutes = [
      {
        path: '/404.html',
        component: 'component---src-pages-404-tsx',
        exact: true,
      },
    ];

    const options: PluginOptions = {
      filename: 'llms.txt',
      includeBlog: true,
      includeDocs: true,
      includePages: true,
      maxDepth: 3,
      excludeRoutes: [],
      includeFullContent: false,
    };

    const result = await createLlmsTxt({
      siteConfig,
      routes: emptyRoutes,
      options,
    });

    expect(result).toBeNull();
  });
});
