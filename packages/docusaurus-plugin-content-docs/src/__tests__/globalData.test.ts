/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toGlobalDataVersion} from '../globalData';
import {createSidebarsUtils} from '../sidebars/utils';
import {getCategoryGeneratedIndexMetadataList} from '../categoryGeneratedIndex';
import type {Sidebars} from '../sidebars/types';

describe('toGlobalDataVersion', () => {
  it('generates the right docs, sidebars, and metadata', () => {
    const docs = [
      {
        unversionedId: 'main',
        permalink: '/current/main',
        sidebar: 'tutorial',
        frontMatter: {},
      },
      {
        unversionedId: 'doc',
        permalink: '/current/doc',
        sidebar: 'tutorial',
        frontMatter: {},
      },
    ];
    const sidebars: Sidebars = {
      tutorial: [
        {
          type: 'doc',
          id: 'main',
        },
        {
          type: 'category',
          label: 'Generated',
          link: {
            type: 'generated-index',
            permalink: '/current/generated',
            slug: '/current/generated',
          },
          items: [
            {
              type: 'doc',
              id: 'doc',
            },
          ],
        },
      ],
      links: [
        {
          type: 'link',
          href: 'foo',
          label: 'Foo',
        },
        {
          type: 'link',
          href: 'bar',
          label: 'Bar',
        },
      ],
      another: [
        {
          type: 'category',
          label: 'Generated',
          link: {
            type: 'generated-index',
            permalink: '/current/generated-2',
            slug: '/current/generated-2',
          },
          items: [
            {
              type: 'doc',
              id: 'doc',
            },
          ],
        },
      ],
    };
    const sidebarsUtils = createSidebarsUtils(sidebars);
    expect(
      toGlobalDataVersion({
        versionName: 'current',
        label: 'Label',
        isLast: true,
        path: '/current',
        mainDocId: 'main',
        docs,
        drafts: [
          {
            unversionedId: 'some-draft-id',
            permalink: '/current/draft',
            sidebar: undefined,
          },
        ],
        sidebars,
        categoryGeneratedIndices: getCategoryGeneratedIndexMetadataList({
          docs,
          sidebarsUtils,
        }),
        sidebarsUtils,
        banner: 'unreleased',
        badge: true,
        className: 'current-cls',
        tagsPath: '/current/tags',
        contentPath: '',
        contentPathLocalized: '',
        sidebarFilePath: '',
        routePriority: 0.5,
      }),
    ).toMatchSnapshot();
  });
});
