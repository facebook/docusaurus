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

  expect(await getHeadings(md)).toEqual([
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  children: [
                    {
                      children: [],
                      id: 'foxtrot',
                      level: 6,
                      value: 'Foxtrot',
                    },
                  ],
                  id: 'echo',
                  level: 5,
                  value: 'Echo',
                },
              ],
              id: 'delta',
              level: 4,
              value: 'Delta',
            },
          ],
          id: 'charlie',
          level: 3,
          value: 'Charlie',
        },
      ],
      id: 'bravo',
      level: 2,
      value: 'Bravo',
    },
  ]);
});

test('should process real-world well-formatted md', async () => {
  const md = `
# title

some text

## section 1

some text

### subsection 1-1

some text

#### subsection 1-1-1

some text

#### subsection 1-1-2

some text

### subsection 1-2

some text

### subsection 1-3

some text

## section 2

some text

### subsection 2-1

some text

### subsection 2-1

some text

## section 3

some text

### subsection 3-1

some text

### subsection 3-2

some text

  `;

  expect(await getHeadings(md)).toEqual([
    {
      children: [
        {
          children: [
            {
              children: [],
              id: 'subsection-1-1-1',
              level: 4,
              value: 'subsection 1-1-1',
            },
            {
              children: [],
              id: 'subsection-1-1-2',
              level: 4,
              value: 'subsection 1-1-2',
            },
          ],
          id: 'subsection-1-1',
          level: 3,
          value: 'subsection 1-1',
        },
        {children: [], id: 'subsection-1-2', level: 3, value: 'subsection 1-2'},
        {children: [], id: 'subsection-1-3', level: 3, value: 'subsection 1-3'},
      ],
      id: 'section-1',
      level: 2,
      value: 'section 1',
    },
    {
      children: [
        {children: [], id: 'subsection-2-1', level: 3, value: 'subsection 2-1'},
        {
          children: [],
          id: 'subsection-2-1-1',
          level: 3,
          value: 'subsection 2-1',
        },
      ],
      id: 'section-2',
      level: 2,
      value: 'section 2',
    },
    {
      children: [
        {children: [], id: 'subsection-3-1', level: 3, value: 'subsection 3-1'},
        {children: [], id: 'subsection-3-2', level: 3, value: 'subsection 3-2'},
      ],
      id: 'section-3',
      level: 2,
      value: 'section 3',
    },
  ]);
});
