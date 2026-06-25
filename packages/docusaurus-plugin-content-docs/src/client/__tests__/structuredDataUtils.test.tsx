/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

// Jest doesn't allow pragma below other comments. https://github.com/facebook/jest/issues/12573
// eslint-disable-next-line header/header
import React from 'react';
import {renderHook} from '@testing-library/react';
import {Context} from '@docusaurus/core/src/client/docusaurusContext';
import {useBreadcrumbsStructuredData} from '../structuredDataUtils';
import type {PropSidebarBreadcrumbsItem} from '@docusaurus/plugin-content-docs';
import type {DocusaurusContext} from '@docusaurus/types';

const siteUrl = 'https://example.com';

function renderStructuredData(breadcrumbs: PropSidebarBreadcrumbsItem[]) {
  return renderHook(() => useBreadcrumbsStructuredData({breadcrumbs}), {
    wrapper: ({children}) => (
      <Context.Provider
        value={
          {
            siteConfig: {url: siteUrl},
          } as unknown as DocusaurusContext
        }>
        {children}
      </Context.Provider>
    ),
  }).result.current;
}

// Narrow itemListElement to a flat array for easier assertions
type ListItem = {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
};

function getItems(result: ReturnType<typeof renderStructuredData>): ListItem[] {
  return (result.itemListElement ?? []) as unknown as ListItem[];
}

describe('useBreadcrumbsStructuredData', () => {
  it('returns a valid BreadcrumbList schema object', () => {
    // @context and @type are required for valid JSON-LD. A refactor that drops
    // either field would invalidate all structured data without any test failing.
    const result = renderStructuredData([
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
    ]);
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('BreadcrumbList');
  });

  it('includes breadcrumbs with href in itemListElement', () => {
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
      {
        type: 'category',
        href: '/docs/guides',
        label: 'Guides',
        items: [],
        collapsed: false,
        collapsible: true,
      },
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    expect(items).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Introduction',
        item: `${siteUrl}/docs/intro`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: `${siteUrl}/docs/guides`,
      },
    ]);
  });

  it('excludes breadcrumbs without href from itemListElement', () => {
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
      {
        type: 'category',
        href: undefined,
        label: 'No-link Category',
        items: [],
        collapsed: false,
        collapsible: true,
      },
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    expect(items).toHaveLength(1);
    expect(items[0]!.name).toBe('Introduction');
  });

  it('excludes unlisted category links from itemListElement', () => {
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
      {
        type: 'category',
        href: '/docs/unlisted-category',
        label: 'Unlisted Category',
        linkUnlisted: true,
        items: [],
        collapsed: false,
        collapsible: true,
      },
      {type: 'link', href: '/docs/intro/page', label: 'Page'},
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    // The unlisted category has an href but must not appear in structured data
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.name)).toEqual(['Introduction', 'Page']);
  });

  it('re-numbers positions contiguously after a filtered item', () => {
    // BreadcrumbList requires sequential position integers starting at 1.
    // Filtering an item from the middle must not leave a gap (e.g. 1, 3).
    // Also verifies that the item URLs of surviving entries are correct.
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
      {
        type: 'category',
        href: '/docs/unlisted-category',
        label: 'Unlisted Category',
        linkUnlisted: true,
        items: [],
        collapsed: false,
        collapsible: true,
      },
      {type: 'link', href: '/docs/intro/page', label: 'Page'},
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    expect(items).toHaveLength(2);
    expect(items[0]!.position).toBe(1);
    expect(items[1]!.position).toBe(2); // not 3
    expect(items[0]!.item).toBe(`${siteUrl}/docs/intro`);
    expect(items[1]!.item).toBe(`${siteUrl}/docs/intro/page`);
  });

  it('includes listed category links in itemListElement', () => {
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {
        type: 'category',
        href: '/docs/listed-category',
        label: 'Listed Category',
        linkUnlisted: false,
        items: [],
        collapsed: false,
        collapsible: true,
      },
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    expect(items).toHaveLength(1);
    expect(items[0]!.item).toBe(`${siteUrl}/docs/listed-category`);
  });

  it('does not exclude link-type breadcrumbs that have unlisted:true', () => {
    // PropSidebarItemLink has `unlisted?: boolean` — a different field from
    // PropSidebarItemCategory's `linkUnlisted`. An unlisted doc that appears
    // in a breadcrumb trail is the current page; its URL is valid and should
    // be emitted. The filter must not conflate the two fields.
    const breadcrumbs: PropSidebarBreadcrumbsItem[] = [
      {type: 'link', href: '/docs/intro', label: 'Introduction'},
      {
        type: 'link',
        href: '/docs/unlisted-doc',
        label: 'Unlisted Doc',
        unlisted: true,
      },
    ];
    const items = getItems(renderStructuredData(breadcrumbs));
    expect(items).toHaveLength(2);
    expect(items[1]!.name).toBe('Unlisted Doc');
    expect(items[1]!.item).toBe(`${siteUrl}/docs/unlisted-doc`);
  });
});
