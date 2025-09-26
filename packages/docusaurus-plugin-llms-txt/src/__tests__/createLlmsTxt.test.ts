/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createLlmsTxt from '../createLlmsTxt';
import type {PluginOptions} from '@docusaurus/plugin-llms-txt';

// Mock site config
const mockSiteConfig = {
  title: 'Test Documentation Site',
  url: 'https://example.com',
  baseUrl: '/',
  tagline: 'Awesome documentation for testing',
};

// Mock routes
const mockRoutes = [
  {
    path: '/docs/getting-started',
    component: 'component---src-pages-docs-getting-started-tsx',
    exact: true,
  },
  {
    path: '/docs/api-reference',
    component: 'component---src-pages-docs-api-reference-tsx',
    exact: true,
  },
  {
    path: '/blog/2024-01-15-welcome',
    component: 'component---src-pages-blog-2024-01-15-welcome-mdx',
    exact: true,
  },
  {
    path: '/about',
    component: 'component---src-pages-about-tsx',
    exact: true,
  },
  {
    path: '/404.html',
    component: 'component---src-pages-404-tsx',
    exact: true,
  },
  {
    path: '/docs',
    component: 'DocsRoot',
    exact: false,
    routes: [
      {
        path: '/docs/advanced/configuration',
        component: 'component---src-pages-docs-advanced-configuration-mdx',
        exact: true,
      },
    ],
  },
];

const defaultOptions: PluginOptions = {
  filename: 'llms.txt',
  includeBlog: true,
  includeDocs: true,
  includePages: true,
  maxDepth: 3,
  excludeRoutes: [],
  includeFullContent: false,
};

describe('createLlmsTxt', () => {
  it('generates llms.txt with all content types', async () => {
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options: defaultOptions,
    });

    expect(result).toBeTruthy();
    expect(result).toContain('# Test Documentation Site');
    expect(result).toContain('Awesome documentation for testing');
    expect(result).toContain('Site URL: https://example.com/');
    expect(result).toContain('## Content');
    expect(result).toContain('### Documentation');
    expect(result).toContain('### Blog Posts');
    expect(result).toContain('### Pages');
    expect(result).toContain(
      '[Getting Started](https://example.com/docs/getting-started)',
    );
    expect(result).toContain(
      '[2024 01 15 Welcome](https://example.com/blog/2024-01-15-welcome)',
    );
    expect(result).toContain('[About](https://example.com/about)');
  });

  it('excludes blog posts when includeBlog is false', async () => {
    const options = {...defaultOptions, includeBlog: false};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).not.toContain('### Blog Posts');
    expect(result).not.toContain('[2024 01 15 Welcome]');
    expect(result).toContain('### Documentation');
    expect(result).toContain('### Pages');
  });

  it('excludes documentation when includeDocs is false', async () => {
    const options = {...defaultOptions, includeDocs: false};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).not.toContain('### Documentation');
    expect(result).not.toContain('[Getting Started]');
    expect(result).toContain('### Blog Posts');
    expect(result).toContain('### Pages');
  });

  it('excludes pages when includePages is false', async () => {
    const options = {...defaultOptions, includePages: false};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).not.toContain('### Pages');
    expect(result).not.toContain('[About]');
    expect(result).toContain('### Documentation');
    expect(result).toContain('### Blog Posts');
  });

  it('respects excludeRoutes option', async () => {
    const options = {...defaultOptions, excludeRoutes: ['/docs/api-reference']};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).not.toContain('[Api Reference]');
    expect(result).toContain('[Getting Started]');
  });

  it('includes custom content when provided', async () => {
    const customContent =
      'This is a custom description of our documentation site.';
    const options = {...defaultOptions, customContent};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).toContain(customContent);
  });

  it('returns null when no routes match criteria', async () => {
    const emptyRoutes = [
      {
        path: '/404.html',
        component: 'component---src-pages-404-tsx',
        exact: true,
      },
    ];

    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: emptyRoutes,
      options: defaultOptions,
    });

    expect(result).toBeNull();
  });

  it('handles custom site title and description', async () => {
    const options = {
      ...defaultOptions,
      siteTitle: 'Custom Site Title',
      siteDescription: 'Custom site description',
    };

    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    expect(result).toContain('# Custom Site Title');
    expect(result).toContain('Custom site description');
  });

  it('respects maxDepth setting', async () => {
    const options = {...defaultOptions, maxDepth: 0};
    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: mockRoutes,
      options,
    });

    expect(result).toBeTruthy();
    // Should still include direct routes but not nested ones
    expect(result).toContain('[Getting Started]');
    expect(result).not.toContain('[Configuration]'); // This is nested
  });

  it('filters out utility routes automatically', async () => {
    const routesWithUtility = [
      ...mockRoutes,
      {
        path: '/search',
        component: 'SearchPage',
        exact: true,
      },
      {
        path: '/__docusaurus/debug',
        component: 'DebugPage',
        exact: true,
      },
    ];

    const result = await createLlmsTxt({
      siteConfig: mockSiteConfig,
      routes: routesWithUtility,
      options: defaultOptions,
    });

    expect(result).toBeTruthy();
    expect(result).not.toContain('/search');
    expect(result).not.toContain('/__docusaurus');
    expect(result).not.toContain('/404.html');
  });

  it('generates proper URLs with different baseUrl', async () => {
    const customSiteConfig = {
      ...mockSiteConfig,
      baseUrl: '/docs/',
    };

    const result = await createLlmsTxt({
      siteConfig: customSiteConfig,
      routes: mockRoutes,
      options: defaultOptions,
    });

    expect(result).toBeTruthy();
    expect(result).toContain('Site URL: https://example.com/docs/');
    expect(result).toContain('(https://example.com/docs/docs/getting-started)');
  });
});
