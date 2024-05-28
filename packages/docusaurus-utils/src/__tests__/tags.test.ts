/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {getTagsFile} from '@docusaurus/utils-validation';
import {processFileTagsPath, reportInlineTags} from '@docusaurus/utils';
import {
  groupTaggedItems,
  getTagVisibility,
  normalizeTags,
  normalizeTag,
} from '../tags';
import type {
  TagsFile,
  Tag,
  NormalizedTag,
  FrontMatterTag,
  TagsPluginOptions,
} from '../tags';

// TODO one by one test small
describe('normalize tags', () => {
  it('normalize single inline tag', async () => {
    const tagsFile: TagsFile = {};

    const frontMatterTags = ['hello'];

    const normalizedTags = normalizeTags({
      tagsBaseRoutePath: '/tags',
      tagsFile,
      frontMatterTags,
    });

    const expected: NormalizedTag[] = [
      {
        inline: true,
        label: 'hello',
        permalink: '/tags/hello',
        description: undefined,
      },
    ];

    expect(normalizedTags).toEqual(expected);
  });

  it('normalize single defined tag', async () => {
    const tagsFile: TagsFile = {
      hello: {
        label: 'hello',
        permalink: '/hello',
      },
    };

    const frontMatterTags = ['hello'];

    const normalizedTags = normalizeTags({
      tagsBaseRoutePath: '/tags',
      tagsFile,
      frontMatterTags,
    });

    const expected: NormalizedTag[] = [
      {
        inline: false,
        label: 'hello',
        permalink: '/tags/hello',
        description: undefined,
      },
    ];

    expect(normalizedTags).toEqual(expected);
  });

  it('normalize single inline tag object', async () => {
    const tagsFile: TagsFile = {};

    const frontMatterTags = [{label: 'hello', permalink: 'hello'}];

    const normalizedTags = normalizeTags({
      tagsBaseRoutePath: '/tags',
      tagsFile,
      frontMatterTags,
    });

    const expected: NormalizedTag[] = [
      {
        inline: true,
        label: 'hello',
        permalink: '/tags/hello',
        description: undefined,
      },
    ];

    expect(normalizedTags).toEqual(expected);
  });

  it('normalize single defined tag with description', async () => {
    const tagsFile: TagsFile = {
      hello: {
        label: 'hello',
        permalink: '/hello',
        description: 'hello description',
      },
    };

    const frontMatterTags = ['hello'];

    const normalizedTags = normalizeTags({
      tagsBaseRoutePath: '/tags',
      tagsFile,
      frontMatterTags,
    });

    const expected: NormalizedTag[] = [
      {
        inline: false,
        label: 'hello',
        permalink: '/tags/hello',
        description: 'hello description',
      },
    ];

    expect(normalizedTags).toEqual(expected);
  });
});

describe('normalizeFrontMatterTags', () => {
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

const createTest = async ({
  onInlineTags,
  frontMatterTags,
}: {
  onInlineTags: TagsPluginOptions['onInlineTags'];
  frontMatterTags: FrontMatterTag[];
}) => {
  const tagFile = 'tags.yml';
  const contentPath = path.join(__dirname, '__fixtures__', 'tags');

  const definedTags = await getTagsFile(
    {
      onInlineTags,
      tags: tagFile,
    },
    contentPath,
  );

  return processFileTagsPath({
    tagsFile: definedTags,
    options: {
      tags: tagFile,
      onInlineTags,
    },
    source: 'default.md',
    tagsBaseRoutePath: '/processFileTagsPath/tags',
    frontMatterTags,
  });
};

describe('processFileTagsPath', () => {
  it('throw when docs has invalid tags', async () => {
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

  it('warns when docs has invalid tags', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

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
      options: {onInlineTags: 'warn', tags: 'tags.yml'},
    });

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/.*\[WARNING\].*Tags.*/),
    );
    consoleWarnSpy.mockRestore();
  });

  it('ignore when docs has invalid tags', async () => {
    const process = createTest({
      frontMatterTags: ['unknownTag'],
      onInlineTags: 'ignore',
    });
    await expect(process).resolves.toBeDefined();
  });

  it('throw for unknown string and object tag', async () => {
    const process = createTest({
      frontMatterTags: [
        'open',
        'world',
        {label: 'hello', permalink: 'hello'},
        {label: 'open', permalink: 'open'},
      ],
      onInlineTags: 'throw',
    });
    await expect(process).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Tags [world, hello, open] used in default.md are not defined in tags.yml"`,
    );
  });

  it('does not throw when docs has valid tags', async () => {
    const process = createTest({
      frontMatterTags: ['open'],
      onInlineTags: 'throw',
    });
    await expect(process).resolves.toBeDefined();
  });
});
