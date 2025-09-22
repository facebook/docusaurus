/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import type {
  PluginOptions,
  LlmsTxtEntry,
  LlmsTxtContent,
} from '@docusaurus/plugin-llms-txt';

// Import the minimal types we need
type DocusaurusConfig = {
  title: string;
  url: string;
  baseUrl: string;
  tagline?: string;
};

type RouteConfig = {
  path: string;
  component: string | unknown;
  exact?: boolean;
  routes?: RouteConfig[];
};

function shouldIncludeRoute(
  route: RouteConfig,
  options: PluginOptions,
  currentDepth = 0,
): boolean {
  // Check depth limit
  if (currentDepth > options.maxDepth) {
    return false;
  }

  // Check if route is excluded
  if (options.excludeRoutes.some((pattern) => route.path?.includes(pattern))) {
    return false;
  }

  // Exclude non-exact routes (they are usually wrappers)
  if (!route.exact) {
    return false;
  }

  // Exclude routes without path
  if (!route.path) {
    return false;
  }

  // Exclude utility routes
  const excludedPaths = ['/404.html', '/search', '/__docusaurus', '/tags'];

  if (excludedPaths.some((excluded) => route.path?.startsWith(excluded))) {
    return false;
  }

  // Check content type inclusion options
  const routeType = getRouteType(route.path);
  if (routeType === 'doc' && !options.includeDocs) {
    return false;
  }
  if (routeType === 'blog' && !options.includeBlog) {
    return false;
  }
  if (routeType === 'page' && !options.includePages) {
    return false;
  }

  return true;
}

function getRouteType(path: string): 'doc' | 'blog' | 'page' {
  if (path.includes('/docs/') || path.startsWith('/docs')) {
    return 'doc';
  }
  if (path.includes('/blog/') || path.startsWith('/blog')) {
    return 'blog';
  }
  return 'page';
}

function extractTitleFromRoute(route: RouteConfig): string {
  // Extract title from route path
  const pathParts = (route.path || '').split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
      // Clean up the path segment and convert to title case
      return lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
  }

  return 'Untitled Page';
}

function collectRoutes(
  routes: RouteConfig[],
  options: PluginOptions,
  currentDepth = 0,
): RouteConfig[] {
  const collectedRoutes: RouteConfig[] = [];

  for (const route of routes) {
    if (shouldIncludeRoute(route, options, currentDepth)) {
      collectedRoutes.push(route);
    }

    // Recursively collect child routes
    if (route.routes && currentDepth < options.maxDepth) {
      collectedRoutes.push(
        ...collectRoutes(route.routes, options, currentDepth + 1),
      );
    }
  }

  return collectedRoutes;
}

function createLlmsTxtEntries(
  routes: RouteConfig[],
  siteConfig: DocusaurusConfig,
  options: PluginOptions,
): LlmsTxtEntry[] {
  const entries: LlmsTxtEntry[] = [];
  const validRoutes = collectRoutes(routes, options);

  for (const route of validRoutes) {
    if (!route.path) {
      continue;
    }

    const entry: LlmsTxtEntry = {
      title: extractTitleFromRoute(route),
      url: normalizeUrl([siteConfig.url, siteConfig.baseUrl, route.path]),
      type: getRouteType(route.path),
    };

    entries.push(entry);
  }

  // Sort entries by type and then by URL for consistent output
  return entries.sort((a, b) => {
    if (a.type !== b.type) {
      const typeOrder = {doc: 0, blog: 1, page: 2};
      return typeOrder[a.type] - typeOrder[b.type];
    }
    return a.url.localeCompare(b.url);
  });
}

function formatLlmsTxtContent(
  content: LlmsTxtContent,
  options: PluginOptions,
): string {
  const lines: string[] = [];

  // Header section
  lines.push(`# ${content.siteTitle}`);
  lines.push('');
  if (content.siteDescription) {
    lines.push(content.siteDescription);
    lines.push('');
  }
  lines.push(`Site URL: ${content.siteUrl}`);
  lines.push(`Last updated: ${content.lastUpdated}`);
  lines.push('');

  // Add custom content if provided
  if (options.customContent) {
    lines.push(options.customContent);
    lines.push('');
  }

  lines.push('## Content');
  lines.push('');

  // Group entries by type
  const groupedEntries = content.entries.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type]!.push(entry);
    return acc;
  }, {} as Record<string, LlmsTxtEntry[]>);

  // Output each group
  const typeLabels = {
    doc: 'Documentation',
    blog: 'Blog Posts',
    page: 'Pages',
  };

  for (const [type, typeEntries] of Object.entries(groupedEntries)) {
    if (typeEntries.length === 0) {
      continue;
    }

    const typeLabel = typeLabels[type as keyof typeof typeLabels];
    if (typeLabel) {
      lines.push(`### ${typeLabel}`);
      lines.push('');

      for (const entry of typeEntries) {
        lines.push(`- [${entry.title}](${entry.url})`);
        if (entry.description) {
          lines.push(`  ${entry.description}`);
        }
        if (options.includeFullContent && entry.content) {
          lines.push(`  ${entry.content.substring(0, 200)}...`);
        }
      }
      lines.push('');
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

export default async function createLlmsTxt({
  siteConfig,
  routes,
  options,
}: {
  siteConfig: DocusaurusConfig;
  routes: RouteConfig[];
  options: PluginOptions;
}): Promise<string | null> {
  const entries = createLlmsTxtEntries(routes, siteConfig, options);

  if (entries.length === 0) {
    return null;
  }

  const content: LlmsTxtContent = {
    siteTitle: options.siteTitle || siteConfig.title,
    siteDescription: options.siteDescription || siteConfig.tagline || '',
    siteUrl: normalizeUrl([siteConfig.url, siteConfig.baseUrl]),
    entries,
    lastUpdated: new Date().toISOString().split('T')[0]!, // YYYY-MM-DD format
  };

  return formatLlmsTxtContent(content, options);
}
