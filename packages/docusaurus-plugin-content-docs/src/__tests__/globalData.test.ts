/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toGlobalDataVersion} from '../globalData';

describe('toGlobalDataVersion', () => {
  it('generates the right docs, sidebars, and metadata', () => {
    expect(
      toGlobalDataVersion({
        versionName: 'current',
        versionLabel: 'Label',
        isLast: true,
        versionPath: '/current',
        mainDocId: 'main',
        docs: [
          {
            unversionedId: 'main',
            permalink: '/current/main',
            sidebar: 'tutorial',
          },
          {
            unversionedId: 'doc',
            permalink: '/current/doc',
            sidebar: 'tutorial',
          },
        ],
        sidebars: {
          another: [
            {
              type: 'category',
              label: 'Generated',
              link: {
                type: 'generated-index',
                permalink: '/current/generated',
              },
              items: [
                {
                  type: 'doc',
                  id: 'doc',
                },
              ],
            },
          ],
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
        },
        categoryGeneratedIndices: [
          {
            title: 'Generated',
            slug: '/current/generated',
            permalink: '/current/generated',
            sidebar: 'tutorial',
          },
        ],
        versionBanner: 'unreleased',
        versionBadge: true,
        versionClassName: 'current-cls',
        tagsPath: '/current/tags',
        contentPath: '',
        contentPathLocalized: '',
        sidebarFilePath: '',
        routePriority: 0.5,
      }),
    ).toMatchSnapshot();
  });
});
