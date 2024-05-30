/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  reportInlineTags,
  groupTaggedItems,
  getTagVisibility,
} from '@docusaurus/utils';
import {normalizeTag} from '../tags';
import type {Tag, NormalizedTag, FrontMatterTag} from '../tags';

describe('normalizeTag', () => {
  const tagsBaseRoutePath = '/all/tags';

  describe('inline', () => {
    it('normalizes simple string tag', () => {
      const input: FrontMatterTag = 'tag';
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag',
        permalink: `${tagsBaseRoutePath}/tag`,
      };
      expect(
        normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
      ).toEqual(expectedOutput);
    });

    it('normalizes complex string tag', () => {
      const input: FrontMatterTag = 'some more Complex_tag';
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'some more Complex_tag',
        permalink: `${tagsBaseRoutePath}/some-more-complex-tag`,
      };
      expect(
        normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
      ).toEqual(expectedOutput);
    });

    it('normalizes simple object tag', () => {
      const input: FrontMatterTag = {label: 'tag', permalink: 'tagPermalink'};
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag',
        permalink: `${tagsBaseRoutePath}/tagPermalink`,
      };
      expect(
        normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
      ).toEqual(expectedOutput);
    });

    it('normalizes complex string tag with object tag', () => {
      const input: FrontMatterTag = {
        label: 'tag complex Label',
        permalink: '/MoreComplex/Permalink',
      };
      const expectedOutput: NormalizedTag = {
        inline: true,
        label: 'tag complex Label',
        permalink: `${tagsBaseRoutePath}/MoreComplex/Permalink`,
      };
      expect(
        normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
      ).toEqual(expectedOutput);
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

describe('reportInlineTags', () => {
  const tagsFile = {
    hello: {
      label: 'Hello',
      permalink: '/hello',
      description: undefined,
    },
    test: {
      label: 'Test',
      permalink: '/test',
      description: undefined,
    },
    open: {
      label: 'Open Source',
      permalink: '/open',
      description: undefined,
    },
  };

  it('throw when inline tags found', () => {
    const testFn = () =>
      reportInlineTags({
        tags: [
          {
            label: 'hello',
            permalink: 'hello',
            inline: true,
          },
          {
            label: 'world',
            permalink: 'world',
            inline: true,
          },
        ],
        source: 'wrong.md',
        options: {onInlineTags: 'throw', tags: 'tags.yml'},
      });

    expect(testFn).toThrowErrorMatchingInlineSnapshot(
      `"Tags [hello, world] used in wrong.md are not defined in tags.yml"`,
    );
  });

  it('ignore when docs has invalid tags', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const testFn = reportInlineTags({
      tags: [
        {
          label: 'hello',
          permalink: 'hello',
          inline: false,
        },
        {
          label: 'world',
          permalink: 'world',
          inline: true,
        },
      ],
      source: 'wrong.md',
      options: {onInlineTags: 'ignore', tags: 'tags.yml'},
    });
    expect(testFn).toBeUndefined();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('throw for unknown string and object tag', () => {
    const frontmatter = ['open', 'world'];
    const tags = frontmatter.map((tag) =>
      normalizeTag({
        tagsBaseRoutePath: '/tags',
        tagsFile,
        tag,
      }),
    );

    const testFn = () =>
      reportInlineTags({
        tags,
        source: 'default.md',
        options: {
          onInlineTags: 'throw',
          tags: 'tags.yml',
        },
      });
    expect(testFn).toThrowErrorMatchingInlineSnapshot(
      `"Tags [world] used in default.md are not defined in tags.yml"`,
    );
  });

  it('does not throw when docs has valid tags', () => {
    const frontmatter = ['open'];
    const tags = frontmatter.map((tag) =>
      normalizeTag({
        tagsBaseRoutePath: '/tags',
        tagsFile,
        tag,
      }),
    );
    const testFn = () =>
      reportInlineTags({
        tags,
        source: 'wrong.md',
        options: {
          onInlineTags: 'throw',
          tags: 'tags.yml',
        },
      });
    expect(testFn).not.toThrow();
  });
});
