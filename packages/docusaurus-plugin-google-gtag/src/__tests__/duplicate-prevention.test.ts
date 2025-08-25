/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pluginGoogleGtag from '../index';

// Mock the window object for testing
const mockWindow = {
  gtag: undefined as (() => void) | undefined,
  dataLayer: undefined as unknown[] | undefined,
};

// Mock document for testing
const mockDocument = {
  querySelector: jest.fn(),
};

// Mock process.env
const originalEnv = process.env;

describe('Duplicate Google Analytics Prevention', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockWindow.gtag = undefined;
    mockWindow.dataLayer = undefined;

    // Mock global objects
    global.window = mockWindow as unknown as Window & typeof globalThis;
    global.document = mockDocument as unknown as Document;

    // Set production environment
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  const mockContext = {} as unknown;
  const mockOptions = {
    trackingID: ['G-TEST123'],
    anonymizeIP: false,
  };

  it('injects GA scripts when GA is not already loaded', () => {
    // Mock document.querySelector to return null (no existing GA)
    mockDocument.querySelector.mockReturnValue(null);

    const plugin = pluginGoogleGtag(mockContext, mockOptions);
    expect(plugin).not.toBeNull();

    const htmlTags = plugin!.injectHtmlTags!();
    const headTags = htmlTags.headTags;

    // Should include GA scripts
    const gaScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {src?: string}};
      return (
        t.tagName === 'script' &&
        t.attributes?.src?.includes('googletagmanager.com/gtag/js')
      );
    });
    expect(gaScript).toBeDefined();

    const gaConfigScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; innerHTML?: string};
      return t.tagName === 'script' && t.innerHTML?.includes('gtag');
    });
    expect(gaConfigScript).toBeDefined();
  });

  it('does not inject GA scripts when gtag function already exists', () => {
    // Mock existing gtag function
    jest.spyOn(mockWindow, 'gtag').mockImplementation();

    const plugin = pluginGoogleGtag(mockContext, mockOptions);
    expect(plugin).not.toBeNull();

    const htmlTags = plugin!.injectHtmlTags!();
    const headTags = htmlTags.headTags;

    // Should NOT include GA scripts
    const gaScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {src?: string}};
      return (
        t.tagName === 'script' &&
        t.attributes?.src?.includes('googletagmanager.com/gtag/js')
      );
    });
    expect(gaScript).toBeUndefined();

    const gaConfigScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; innerHTML?: string};
      return t.tagName === 'script' && t.innerHTML?.includes('gtag');
    });
    expect(gaConfigScript).toBeUndefined();
  });

  it('does not inject GA scripts when dataLayer already exists', () => {
    // Mock existing dataLayer
    mockWindow.dataLayer = [];

    const plugin = pluginGoogleGtag(mockContext, mockOptions);
    expect(plugin).not.toBeNull();

    const htmlTags = plugin!.injectHtmlTags!();
    const headTags = htmlTags.headTags;

    // Should NOT include GA scripts
    const gaScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {src?: string}};
      return (
        t.tagName === 'script' &&
        t.attributes?.src?.includes('googletagmanager.com/gtag/js')
      );
    });
    expect(gaScript).toBeUndefined();
  });

  it('does not inject GA scripts when GA script tag already exists', () => {
    // Mock existing GA script tag
    mockDocument.querySelector.mockReturnValue({
      src: 'https://googletagmanager.com/gtag/js?id=G-EXISTING',
    } as unknown as Element);

    const plugin = pluginGoogleGtag(mockContext, mockOptions);
    expect(plugin).not.toBeNull();

    const htmlTags = plugin!.injectHtmlTags!();
    const headTags = htmlTags.headTags;

    // Should NOT include GA scripts
    const gaScript = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {src?: string}};
      return (
        t.tagName === 'script' &&
        t.attributes?.src?.includes('googletagmanager.com/gtag/js')
      );
    });
    expect(gaScript).toBeUndefined();
  });

  it('always includes preconnect links regardless of GA status', () => {
    // Mock existing GA
    jest.spyOn(mockWindow, 'gtag').mockImplementation();

    const plugin = pluginGoogleGtag(mockContext, mockOptions);
    expect(plugin).not.toBeNull();

    const htmlTags = plugin!.injectHtmlTags!();
    const headTags = htmlTags.headTags;

    // Should always include preconnect links
    const analyticsPreconnect = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {href?: string}};
      return (
        t.tagName === 'link' &&
        t.attributes?.href === 'https://www.google-analytics.com'
      );
    });
    expect(analyticsPreconnect).toBeDefined();

    const tagManagerPreconnect = headTags.find((tag: unknown) => {
      const t = tag as {tagName: string; attributes?: {href?: string}};
      return (
        t.tagName === 'link' &&
        t.attributes?.href === 'https://www.googletagmanager.com'
      );
    });
    expect(tagManagerPreconnect).toBeDefined();
  });
});
