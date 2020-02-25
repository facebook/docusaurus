/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {linkify} from '../blogUtils';
import {BlogPost} from '../types';

const sitePath = path.join(__dirname, '__fixtures__', 'website');
const blogPath = path.join(sitePath, 'blog');
const pluginDir = 'blog';
const blogPosts: BlogPost[] = [
  {
    id: 'Happy 1st Birthday Slash!',
    metadata: {
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      source: path.join(
        '@site',
        pluginDir,
        '2018-12-14-Happy-First-Birthday-Slash.md',
      ),
      title: 'Happy 1st Birthday Slash!',
      description: `pattern name`,
      date: new Date('2018-12-14'),
      tags: [],
      prevItem: {
        permalink: '/blog/2019/01/01/date-matter',
        title: 'date-matter',
      },
      truncated: false,
    },
  },
];

const transform = filepath => {
  const content = fs.readFileSync(filepath, 'utf-8');
  const transformedContent = linkify(content, sitePath, blogPath, blogPosts);
  return [content, transformedContent];
};

test('transform to correct link', () => {
  const post = path.join(blogPath, 'with reference.md');
  const [content, transformedContent] = transform(post);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain(
    '](/blog/2018/12/14/Happy-First-Birthday-Slash',
  );
  expect(transformedContent).not.toContain(
    '](2018-12-14-Happy-First-Birthday-Slash.md)',
  );
  expect(content).not.toEqual(transformedContent);
});
