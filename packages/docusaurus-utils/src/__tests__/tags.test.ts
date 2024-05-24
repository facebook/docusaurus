/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  groupTaggedItems,
  getTagVisibility,
  normalizeTags,
  normalizeTag,
} from '../tags';
import type {TagsFile, Tag, NormalizedTag, FrontMatterTag} from '../tags';

describe('normalize tags', () => {
  it('normalize tags', async () => {
    const tagsFile: TagsFile = {
      open: {
        label: 'Open Source',
        permalink: '/custom-open-source',
        description: 'Learn about the open source',
      },
      test: {label: 'Test', permalink: '/custom-test', description: 'Test'},
    };

    const tags = [
      'hello',
      'world',
      {label: 'hello', permalink: 'hello'},
      {label: 'world', permalink: 'world'},
      'hello',
      'open',
      {label: 'open', permalink: 'open'},
      'test',
    ];

    const normalizedTags = normalizeTags({
      tagsPath: '/tags',
      tagsFile,
      frontMatterTags: tags,
    });

    const expected: NormalizedTag[] = [
      {
        inline: true,
        label: 'hello',
        permalink: '/tags/hello',
      },
      {
        inline: true,
        label: 'world',
        permalink: '/tags/world',
      },
      {
        inline: false,
        label: 'Open Source',
        permalink: '/tags/custom-open-source',
        description: 'Learn about the open source',
      },
      {
        inline: true,
        label: 'open',
        permalink: '/tags/open',
      },
      {
        inline: false,
        label: 'Test',
        permalink: '/tags/custom-test',
        description: 'Test',
      },
    ];

    expect(normalizedTags).toEqual(expected);
  });
});

describe('normalizeFrontMatterTags', () => {
  const tagsPath = '/all/tags';

  describe('inline', () => {
    it('normalizes simple string tag', () => {
      const input: FrontMatterTag = 'tag';
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag',
        permalink: `${tagsPath}/tag`,
      };
      expect(normalizeTag({tagsPath, tagsFile: null, tag: input})).toEqual(
        expectedOutput,
      );
    });

    it('normalizes complex string tag', () => {
      const input: FrontMatterTag = 'some more Complex_tag';
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'some more Complex_tag',
        permalink: `${tagsPath}/some-more-complex-tag`,
      };
      expect(normalizeTag({tagsPath, tagsFile: null, tag: input})).toEqual(
        expectedOutput,
      );
    });

    it('normalizes simple object tag', () => {
      const input: FrontMatterTag = {label: 'tag', permalink: 'tagPermalink'};
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag',
        permalink: `${tagsPath}/tagPermalink`,
      };
      expect(normalizeTag({tagsPath, tagsFile: null, tag: input})).toEqual(
        expectedOutput,
      );
    });

    it('normalizes complex string tag with object tag', () => {
      const input: FrontMatterTag = {
        label: 'tag complex Label',
        permalink: '/MoreComplex/Permalink',
      };
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag complex Label',
        permalink: `${tagsPath}/MoreComplex/Permalink`,
      };
      expect(normalizeTag({tagsPath, tagsFile: null, tag: input})).toEqual(
        expectedOutput,
      );
    });
  });
});

describe('groupTaggedItems', () => {
  type SomeTaggedItem = {
    id: string;
    nested: {
      tags: Tag[];
    };
  };
  function groupItems(items: SomeTaggedItem[]) {
    return groupTaggedItems(items, (item) => item.nested.tags);
  }

  type Input = Parameters<typeof groupItems>[0];
  type Output = ReturnType<typeof groupItems>;

  it('groups items by tag permalink', () => {
    const tagGuide = {label: 'Guide', permalink: '/guide'};
    const tagTutorial = {label: 'Tutorial', permalink: '/tutorial'};
    const tagAPI = {label: 'API', permalink: '/api'};

    // This one will be grouped under same permalink and label is ignored
    const tagTutorialOtherLabel = {
      label: 'TutorialOtherLabel',
      permalink: '/tutorial',
    };

    const item1: SomeTaggedItem = {
      id: '1',
      nested: {
        tags: [
          tagGuide,
          tagTutorial,
          tagAPI,
          // Add some duplicates on purpose: they should be filtered
          tagGuide,
          tagTutorialOtherLabel,
        ],
      },
    };
    const item2: SomeTaggedItem = {
      id: '2',
      nested: {
        tags: [tagAPI],
      },
    };
    const item3: SomeTaggedItem = {
      id: '3',
      nested: {
        tags: [tagTutorial],
      },
    };
    const item4: SomeTaggedItem = {
      id: '4',
      nested: {
        tags: [tagTutorialOtherLabel],
      },
    };

    const input: Input = [item1, item2, item3, item4];

    const expectedOutput: Output = {
      '/guide': {tag: tagGuide, items: [item1]},
      '/tutorial': {tag: tagTutorial, items: [item1, item3, item4]},
      '/api': {tag: tagAPI, items: [item1, item2]},
    };

    expect(groupItems(input)).toEqual(expectedOutput);
  });
});

describe('getTagVisibility', () => {
  type Item = {id: string; unlisted: boolean};

  function isUnlisted(item: Item): boolean {
    return item.unlisted;
  }

  const item1: Item = {id: '1', unlisted: false};
  const item2: Item = {id: '2', unlisted: true};
  const item3: Item = {id: '3', unlisted: false};
  const item4: Item = {id: '4', unlisted: true};

  it('works for some unlisted', () => {
    expect(
      getTagVisibility({
        items: [item1, item2, item3, item4],
        isUnlisted,
      }),
    ).toEqual({
      listedItems: [item1, item3],
      unlisted: false,
    });
  });

  it('works for all unlisted', () => {
    expect(
      getTagVisibility({
        items: [item2, item4],
        isUnlisted,
      }),
    ).toEqual({
      listedItems: [item2, item4],
      unlisted: true,
    });
  });

  it('works for all listed', () => {
    expect(
      getTagVisibility({
        items: [item1, item3],
        isUnlisted,
      }),
    ).toEqual({
      listedItems: [item1, item3],
      unlisted: false,
    });
  });
});
