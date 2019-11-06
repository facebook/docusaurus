/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import linkify from '../linkify';
import {SourceToPermalink} from '../../types';

const siteDir = path.join(__dirname, '__fixtures__');
const docsDir = path.join(siteDir, 'docs');
const sourceToPermalink: SourceToPermalink = {
  '@site/docs/doc1.md': '/docs/doc1',
  '@site/docs/doc2.md': '/docs/doc2',
  '@site/docs/subdir/doc3.md': '/docs/subdir/doc3',
  '@site/docs/doc4.md': '/docs/doc4',
};

const transform = filepath => {
  const content = fs.readFileSync(filepath, 'utf-8');
  const transformedContent = linkify(
    content,
    filepath,
    docsDir,
    siteDir,
    sourceToPermalink,
  );
  return [content, transformedContent];
};

test('transform nothing', () => {
  const doc1 = path.join(docsDir, 'doc1.md');
  const [content, transformedContent] = transform(doc1);
  expect(transformedContent).toMatchSnapshot();
  expect(content).toEqual(transformedContent);
});

test('transform to correct links', () => {
  const doc2 = path.join(docsDir, 'doc2.md');
  const [content, transformedContent] = transform(doc2);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/doc1');
  expect(transformedContent).toContain('](/docs/doc2');
  expect(transformedContent).toContain('](/docs/subdir/doc3');
  expect(transformedContent).not.toContain('](doc1.md)');
  expect(transformedContent).not.toContain('](./doc2.md)');
  expect(transformedContent).not.toContain('](subdir/doc3.md)');
  expect(content).not.toEqual(transformedContent);
});

test('transform relative links', () => {
  const doc3 = path.join(docsDir, 'subdir', 'doc3.md');
  const [content, transformedContent] = transform(doc3);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/doc2');
  expect(transformedContent).not.toContain('](../doc2.md)');
  expect(content).not.toEqual(transformedContent);
});

test('transforms reference links', () => {
  const doc4 = path.join(docsDir, 'doc4.md');
  const [content, transformedContent] = transform(doc4);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('[doc1]: /docs/doc1');
  expect(transformedContent).toContain('[doc2]: /docs/doc2');
  expect(transformedContent).not.toContain('[doc1]: doc1.md');
  expect(transformedContent).not.toContain('[doc2]: ./doc2.md');
  expect(content).not.toEqual(transformedContent);
});
