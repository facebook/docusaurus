/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createContentHelpers} from '../contentHelpers';
import type {LoadedContent, Metadata} from '@docusaurus/plugin-content-pages';

function createMockPage(source: string, permalink: string): Metadata {
  return {
    type: 'mdx',
    source,
    permalink,
    title: `Page ${source}`,
    description: 'Test page',
    frontMatter: {},
    unlisted: false,
  };
}

describe('contentHelpers', () => {
  describe('createContentHelpers', () => {
    it('creates empty maps initially', () => {
      const helpers = createContentHelpers();

      expect(helpers.sourceToPage.size).toBe(0);
      expect(helpers.sourceToPermalink.size).toBe(0);
    });

    it('updates maps when content is provided', () => {
      const helpers = createContentHelpers();

      const content: LoadedContent = [
        createMockPage('@site/src/pages/intro.md', '/intro'),
        createMockPage('@site/src/pages/about.mdx', '/about'),
        createMockPage('@site/src/pages/nested/page.md', '/nested/page'),
      ];

      helpers.updateContent(content);

      expect(helpers.sourceToPage.size).toBe(3);
      expect(helpers.sourceToPermalink.size).toBe(3);

      expect(helpers.sourceToPermalink.get('@site/src/pages/intro.md')).toBe(
        '/intro',
      );
      expect(helpers.sourceToPermalink.get('@site/src/pages/about.mdx')).toBe(
        '/about',
      );
      expect(
        helpers.sourceToPermalink.get('@site/src/pages/nested/page.md'),
      ).toBe('/nested/page');
    });

    it('returns full page metadata in sourceToPage', () => {
      const helpers = createContentHelpers();

      const content: LoadedContent = [
        createMockPage('@site/src/pages/intro.md', '/intro'),
      ];

      helpers.updateContent(content);

      const page = helpers.sourceToPage.get('@site/src/pages/intro.md');
      expect(page).toBeDefined();
      expect(page?.permalink).toBe('/intro');
      expect(page?.source).toBe('@site/src/pages/intro.md');
    });

    it('clears existing content when updated', () => {
      const helpers = createContentHelpers();

      // First update
      helpers.updateContent([
        createMockPage('@site/src/pages/old.md', '/old'),
      ]);

      expect(helpers.sourceToPermalink.has('@site/src/pages/old.md')).toBe(
        true,
      );

      // Second update with different content
      helpers.updateContent([
        createMockPage('@site/src/pages/new.md', '/new'),
      ]);

      expect(helpers.sourceToPermalink.has('@site/src/pages/old.md')).toBe(
        false,
      );
      expect(helpers.sourceToPermalink.has('@site/src/pages/new.md')).toBe(
        true,
      );
      expect(helpers.sourceToPage.size).toBe(1);
    });

    it('handles empty content array', () => {
      const helpers = createContentHelpers();

      // First add some content
      helpers.updateContent([
        createMockPage('@site/src/pages/page.md', '/page'),
      ]);

      expect(helpers.sourceToPage.size).toBe(1);

      // Update with empty array
      helpers.updateContent([]);

      expect(helpers.sourceToPage.size).toBe(0);
      expect(helpers.sourceToPermalink.size).toBe(0);
    });
  });
});
