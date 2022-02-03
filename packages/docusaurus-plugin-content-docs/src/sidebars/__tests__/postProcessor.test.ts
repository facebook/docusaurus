/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ProcessedSidebars} from '../types';
import {postProcessSidebars} from '../postProcessor';

describe('postProcess', () => {
  test('transforms category without subitems', () => {
    const processedSidebar = postProcessSidebars(
      {
        sidebar: [
          {
            type: 'category',
            label: 'Category',
            link: {
              type: 'generated-index',
              slug: 'generated/permalink',
            },
            items: [],
          },
          {
            type: 'category',
            label: 'Category 2',
            link: {
              type: 'doc',
              id: 'doc ID',
            },
            items: [],
          },
        ],
      },
      {
        sidebarOptions: {sidebarCollapsed: true, sidebarCollapsible: true},
        version: {versionPath: 'version'},
      },
    );

    expect(processedSidebar).toEqual({
      sidebar: [
        {
          type: 'link',
          label: 'Category',
          href: 'version/generated/permalink',
        },
        {
          type: 'doc',
          label: 'Category 2',
          id: 'doc ID',
        },
      ],
    } as ProcessedSidebars);

    expect(() => {
      postProcessSidebars(
        {
          sidebar: [
            {
              type: 'category',
              label: 'Bad category',
              items: [],
            },
          ],
        },
        {
          sidebarOptions: {sidebarCollapsed: true, sidebarCollapsible: true},
          version: {versionPath: 'version'},
        },
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Sidebar category Bad category has neither any subitem nor a link. This makes this item not able to link to anything."`,
    );
  });
});
