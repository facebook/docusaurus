/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

    expect(processedSidebar).toMatchInlineSnapshot(`
      Object {
        "sidebar": Array [
          Object {
            "href": "version/generated/permalink",
            "label": "Category",
            "type": "link",
          },
          Object {
            "id": "doc ID",
            "label": "Category 2",
            "type": "doc",
          },
        ],
      }
    `);

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

  test('corrects collapsed state inconsistencies', () => {
    expect(
      postProcessSidebars(
        {
          sidebar: [
            {
              type: 'category',
              label: 'Category',
              collapsed: true,
              collapsible: false,
              items: [{type: 'doc', id: 'foo'}],
            },
          ],
        },

        {
          sidebarOptions: {sidebarCollapsed: true, sidebarCollapsible: true},
          version: {versionPath: 'version'},
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "sidebar": Array [
          Object {
            "collapsed": false,
            "collapsible": false,
            "items": Array [
              Object {
                "id": "foo",
                "type": "doc",
              },
            ],
            "label": "Category",
            "link": undefined,
            "type": "category",
          },
        ],
      }
    `);

    expect(
      postProcessSidebars(
        {
          sidebar: [
            {
              type: 'category',
              label: 'Category',
              collapsed: true,
              items: [{type: 'doc', id: 'foo'}],
            },
          ],
        },

        {
          sidebarOptions: {sidebarCollapsed: false, sidebarCollapsible: false},
          version: {versionPath: 'version'},
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "sidebar": Array [
          Object {
            "collapsed": false,
            "collapsible": false,
            "items": Array [
              Object {
                "id": "foo",
                "type": "doc",
              },
            ],
            "label": "Category",
            "link": undefined,
            "type": "category",
          },
        ],
      }
    `);

    expect(
      postProcessSidebars(
        {
          sidebar: [
            {
              type: 'category',
              label: 'Category',
              items: [{type: 'doc', id: 'foo'}],
            },
          ],
        },

        {
          sidebarOptions: {sidebarCollapsed: true, sidebarCollapsible: false},
          version: {versionPath: 'version'},
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "sidebar": Array [
          Object {
            "collapsed": false,
            "collapsible": false,
            "items": Array [
              Object {
                "id": "foo",
                "type": "doc",
              },
            ],
            "label": "Category",
            "link": undefined,
            "type": "category",
          },
        ],
      }
    `);
  });
});
