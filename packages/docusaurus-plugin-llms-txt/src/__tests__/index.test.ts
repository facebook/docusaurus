/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import pluginLlmsTxt from '../index';
import type {PluginOptions} from '@docusaurus/plugin-llms-txt';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('@docusaurus/logger');

const mockFs = fs as jest.Mocked<typeof fs>;

const mockLoadContext = {
  siteConfig: {
    title: 'Test Site',
    url: 'https://example.com',
    baseUrl: '/',
    tagline: 'Test tagline',
    noIndex: false,
  },
};

const mockRoutes = [
  {
    path: '/docs/intro',
    component: 'component---src-docs-intro-md',
    exact: true,
  },
  {
    path: '/blog/hello',
    component: 'component---src-blog-hello-md',
    exact: true,
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

describe('pluginLlmsTxt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockFs.outputFile as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns a plugin object with correct name', () => {
    const plugin = pluginLlmsTxt(mockLoadContext, defaultOptions);

    expect(plugin).toBeTruthy();
    expect(plugin!.name).toBe('docusaurus-plugin-llms-txt');
    expect(plugin!.postBuild).toBeDefined();
  });

  it('returns null for hash router', () => {
    const hashRouterContext = {
      ...mockLoadContext,
      siteConfig: {
        ...mockLoadContext.siteConfig,
        future: {
          experimental_router: 'hash' as const,
        },
      },
    };

    const plugin = pluginLlmsTxt(hashRouterContext, defaultOptions);
    expect(plugin).toBeNull();
  });

  it('skips generation when noIndex is true', async () => {
    const noIndexContext = {
      ...mockLoadContext,
      siteConfig: {
        ...mockLoadContext.siteConfig,
        noIndex: true,
      },
    };

    const plugin = pluginLlmsTxt(noIndexContext, defaultOptions);
    expect(plugin).toBeTruthy();

    await plugin!.postBuild!({
      siteConfig: noIndexContext.siteConfig,
      routes: mockRoutes,
      outDir: '/tmp/build',
    });

    expect(mockFs.outputFile).not.toHaveBeenCalled();
  });

  it('generates llms.txt file during postBuild', async () => {
    const plugin = pluginLlmsTxt(mockLoadContext, defaultOptions);
    expect(plugin).toBeTruthy();

    const outDir = '/tmp/build';
    await plugin!.postBuild!({
      siteConfig: mockLoadContext.siteConfig,
      routes: mockRoutes,
      outDir,
    });

    expect(mockFs.outputFile).toHaveBeenCalledWith(
      path.join(outDir, 'llms.txt'),
      expect.stringContaining('# Test Site'),
    );
  });

  it('uses custom filename when specified', async () => {
    const customOptions = {...defaultOptions, filename: 'custom-llms.txt'};
    const plugin = pluginLlmsTxt(mockLoadContext, customOptions);
    expect(plugin).toBeTruthy();

    const outDir = '/tmp/build';
    await plugin!.postBuild!({
      siteConfig: mockLoadContext.siteConfig,
      routes: mockRoutes,
      outDir,
    });

    expect(mockFs.outputFile).toHaveBeenCalledWith(
      path.join(outDir, 'custom-llms.txt'),
      expect.any(String),
    );
  });

  it('handles fs.outputFile errors gracefully', async () => {
    const error = new Error('Write failed');
    (mockFs.outputFile as jest.Mock).mockRejectedValue(error);

    const plugin = pluginLlmsTxt(mockLoadContext, defaultOptions);
    expect(plugin).toBeTruthy();

    await expect(
      plugin!.postBuild!({
        siteConfig: mockLoadContext.siteConfig,
        routes: mockRoutes,
        outDir: '/tmp/build',
      }),
    ).rejects.toThrow('Write failed');
  });

  it('does not write file when no content is generated', async () => {
    // Empty routes should result in no file being written
    const plugin = pluginLlmsTxt(mockLoadContext, defaultOptions);
    expect(plugin).toBeTruthy();

    await plugin!.postBuild!({
      siteConfig: mockLoadContext.siteConfig,
      routes: [], // Empty routes
      outDir: '/tmp/build',
    });

    expect(mockFs.outputFile).not.toHaveBeenCalled();
  });

  it('merges options with defaults correctly', () => {
    const partialOptions = {
      filename: 'custom.txt',
      includeBlog: false,
    };

    const plugin = pluginLlmsTxt(
      mockLoadContext,
      partialOptions as PluginOptions,
    );
    expect(plugin).toBeTruthy();

    // The plugin should work with partial options, using defaults for the rest
    expect(plugin!.name).toBe('docusaurus-plugin-llms-txt');
  });
});
