/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  normalizeFrontMatterTag,
  normalizeFrontMatterTags,
  groupTaggedItems,
  Tag,
} from '../tags';

describe('normalizeFrontMatterTag', () => {
  type Input = Parameters<typeof normalizeFrontMatterTag>[1];
  type Output = ReturnType<typeof normalizeFrontMatterTag>;

  test('should normalize simple string tag', () => {
    const tagsPath = '/all/tags';
    const input: Input = 'tag';
    const expectedOutput: Output = {
      label: 'tag',
      permalink: `${tagsPath}/tag`,
    };
    expect(normalizeFrontMatterTag(tagsPath, input)).toEqual(expectedOutput);
  });

  test('should normalize complex string tag', () => {
    const tagsPath = '/all/tags';
    const input: Input = 'some more Complex_tag';
    const expectedOutput: Output = {
      label: 'some more Complex_tag',
      permalink: `${tagsPath}/some-more-complex-tag`,
    };
    expect(normalizeFrontMatterTag(tagsPath, input)).toEqual(expectedOutput);
  });

  test('should normalize simple object tag', () => {
    const tagsPath = '/all/tags';
    const input: Input = {label: 'tag', permalink: 'tagPermalink'};
    const expectedOutput: Output = {
      label: 'tag',
      permalink: `${tagsPath}/tagPermalink`,
    };
    expect(normalizeFrontMatterTag(tagsPath, input)).toEqual(expectedOutput);
  });

  test('should normalize complex string tag', () => {
    const tagsPath = '/all/tags';
    const input: Input = {
      label: 'tag complex Label',
      permalink: '/MoreComplex/Permalink',
    };
    const expectedOutput: Output = {
      label: 'tag complex Label',
      permalink: `${tagsPath}/MoreComplex/Permalink`,
    };
    expect(normalizeFrontMatterTag(tagsPath, input)).toEqual(expectedOutput);
  });
});

describe('normalizeFrontMatterTags', () => {
  type Input = Parameters<typeof normalizeFrontMatterTags>[1];
  type Output = ReturnType<typeof normalizeFrontMatterTags>;

  test('should normalize string list', () => {
    const tagsPath = '/all/tags';
    const input: Input = ['tag 1', 'tag-1', 'tag 3', 'tag1', 'tag-2'];
    // Keep user input order but remove tags that lead to same permalink
    const expectedOutput: Output = [
      {
        label: 'tag 1',
        permalink: `${tagsPath}/tag-1`,
      },
      {
        label: 'tag 3',
        permalink: `${tagsPath}/tag-3`,
      },
      {
        label: 'tag-2',
        permalink: `${tagsPath}/tag-2`,
      },
    ];
    expect(normalizeFrontMatterTags(tagsPath, input)).toEqual(expectedOutput);
  });

  test('should normalize complex mixed list', () => {
    const tagsPath = '/all/tags';
    const input: Input = [
      'tag 1',
      {label: 'tag-1', permalink: '/tag-1'},
      'tag 3',
      'tag1',
      {label: 'tag 4', permalink: '/tag4Permalink'},
    ];
    // Keep user input order but remove tags that lead to same permalink
    const expectedOutput: Output = [
      {
        label: 'tag 1',
        permalink: `${tagsPath}/tag-1`,
      },
      {
        label: 'tag 3',
        permalink: `${tagsPath}/tag-3`,
      },
      {
        label: 'tag 4',
        permalink: `${tagsPath}/tag4Permalink`,
      },
    ];
    expect(normalizeFrontMatterTags(tagsPath, input)).toEqual(expectedOutput);
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

  test('should group items by tag permalink', () => {
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
