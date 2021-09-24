/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import remark from 'remark';
import mdx from 'remark-mdx';
import search from '../search';
import headings from '../../headings/index';

const getHeadings = async (mdText: string) => {
  const node = remark().parse(mdText);
  const result = await remark().use(headings).use(mdx).run(node);
  return search(result);
};

test('should process all heading levels', async () => {
  const md = `
# Alpha

## Bravo

### Charlie

#### Delta

##### Echo

###### Foxtrot

  `;
  const result = await getHeadings(md);
  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "children": Array [
          Object {
            "children": Array [
              Object {
                "children": Array [
                  Object {
                    "children": Array [
                      Object {
                        "children": Array [],
                        "id": "foxtrot",
                        "level": 6,
                        "value": "Foxtrot",
                      },
                    ],
                    "id": "echo",
                    "level": 5,
                    "value": "Echo",
                  },
                ],
                "id": "delta",
                "level": 4,
                "value": "Delta",
              },
            ],
            "id": "charlie",
            "level": 3,
            "value": "Charlie",
          },
        ],
        "id": "bravo",
        "level": 2,
        "value": "Bravo",
      },
    ]
  `);
});
