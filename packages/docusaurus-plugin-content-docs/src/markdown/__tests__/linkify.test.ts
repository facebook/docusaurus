/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {linkify} from '../linkify';
import {
  DocsMarkdownOption,
  SourceToPermalink,
  VersionMetadata,
  BrokenMarkdownLink,
} from '../../types';
import {VERSIONED_DOCS_DIR, CURRENT_VERSION_NAME} from '../../constants';

function createFakeVersion({
  versionName,
  contentPath,
  contentPathLocalized,
}: {
  versionName: string;
  contentPath: string;
  contentPathLocalized: string;
}): VersionMetadata {
  return {
    versionName,
    versionLabel: 'Any',
    versionPath: 'any',
    contentPath,
    contentPathLocalized,
    sidebarFilePath: 'any',
    routePriority: undefined,
    isLast: false,
  };
}

const siteDir = path.join(__dirname, '__fixtures__');

const versionCurrent = createFakeVersion({
  versionName: CURRENT_VERSION_NAME,
  contentPath: path.join(siteDir, 'docs'),
  contentPathLocalized: path.join(
    siteDir,
    'i18n',
    'fr',
    'docusaurus-plugin-content-docs',
    CURRENT_VERSION_NAME,
  ),
});

const version100 = createFakeVersion({
  versionName: '1.0.0',
  contentPath: path.join(siteDir, VERSIONED_DOCS_DIR, 'version-1.0.0'),
  contentPathLocalized: path.join(
    siteDir,
    'i18n',
    'fr',
    'docusaurus-plugin-content-docs',
    'version-1.0.0',
  ),
});

const sourceToPermalink: SourceToPermalink = {
  '@site/docs/doc1.md': '/docs/doc1',
  '@site/docs/doc2.md': '/docs/doc2',
  '@site/docs/subdir/doc3.md': '/docs/subdir/doc3',
  '@site/docs/doc4.md': '/docs/doc4',
  '@site/versioned_docs/version-1.0.0/doc2.md': '/docs/1.0.0/doc2',
  '@site/versioned_docs/version-1.0.0/subdir/doc1.md':
    '/docs/1.0.0/subdir/doc1',

  '@site/i18n/fr/docusaurus-plugin-content-docs/current/doc-localized.md':
    '/fr/doc-localized',
  '@site/docs/doc-localized': '/doc-localized',
};

function createMarkdownOptions(
  options?: Partial<DocsMarkdownOption>,
): DocsMarkdownOption {
  return {
    sourceToPermalink,
    onBrokenMarkdownLink: () => {},
    versionsMetadata: [versionCurrent, version100],
    siteDir,
    ...options,
  };
}

const transform = (filepath: string, options?: Partial<DocsMarkdownOption>) => {
  const markdownOptions = createMarkdownOptions(options);
  const content = fs.readFileSync(filepath, 'utf-8');
  const transformedContent = linkify(content, filepath, markdownOptions);
  return [content, transformedContent];
};

test('transform nothing', () => {
  const doc1 = path.join(versionCurrent.contentPath, 'doc1.md');
  const [content, transformedContent] = transform(doc1);
  expect(transformedContent).toMatchSnapshot();
  expect(content).toEqual(transformedContent);
});

test('transform to correct links', () => {
  const doc2 = path.join(versionCurrent.contentPath, 'doc2.md');
  const [content, transformedContent] = transform(doc2);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/doc1');
  expect(transformedContent).toContain('](/docs/doc2');
  expect(transformedContent).toContain('](/docs/subdir/doc3');
  expect(transformedContent).toContain('](/fr/doc-localized');
  expect(transformedContent).not.toContain('](doc1.md)');
  expect(transformedContent).not.toContain('](./doc2.md)');
  expect(transformedContent).not.toContain('](subdir/doc3.md)');
  expect(transformedContent).not.toContain('](/doc-localized');
  expect(content).not.toEqual(transformedContent);
});

test('transform relative links', () => {
  const doc3 = path.join(versionCurrent.contentPath, 'subdir', 'doc3.md');

  const [content, transformedContent] = transform(doc3);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/doc2');
  expect(transformedContent).not.toContain('](../doc2.md)');
  expect(content).not.toEqual(transformedContent);
});

test('transforms reference links', () => {
  const doc4 = path.join(versionCurrent.contentPath, 'doc4.md');
  const [content, transformedContent] = transform(doc4);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('[doc1]: /docs/doc1');
  expect(transformedContent).toContain('[doc2]: /docs/doc2');
  expect(transformedContent).not.toContain('[doc1]: doc1.md');
  expect(transformedContent).not.toContain('[doc2]: ./doc2.md');
  expect(content).not.toEqual(transformedContent);
});

test('report broken markdown links', () => {
  const doc5 = path.join(versionCurrent.contentPath, 'doc5.md');
  const onBrokenMarkdownLink = jest.fn();
  const [content, transformedContent] = transform(doc5, {
    onBrokenMarkdownLink,
  });
  expect(transformedContent).toEqual(content);
  expect(onBrokenMarkdownLink).toHaveBeenCalledTimes(4);
  expect(onBrokenMarkdownLink).toHaveBeenNthCalledWith(1, {
    filePath: doc5,
    link: 'docNotExist1.md',
    contentPaths: versionCurrent,
  } as BrokenMarkdownLink);
  expect(onBrokenMarkdownLink).toHaveBeenNthCalledWith(2, {
    filePath: doc5,
    link: './docNotExist2.mdx',
    contentPaths: versionCurrent,
  } as BrokenMarkdownLink);
  expect(onBrokenMarkdownLink).toHaveBeenNthCalledWith(3, {
    filePath: doc5,
    link: '../docNotExist3.mdx',
    contentPaths: versionCurrent,
  } as BrokenMarkdownLink);
  expect(onBrokenMarkdownLink).toHaveBeenNthCalledWith(4, {
    filePath: doc5,
    link: './subdir/docNotExist4.md',
    contentPaths: versionCurrent,
  } as BrokenMarkdownLink);
});

test('transforms absolute links in versioned docs', () => {
  const doc2 = path.join(version100.contentPath, 'doc2.md');
  const [content, transformedContent] = transform(doc2);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/1.0.0/subdir/doc1');
  expect(transformedContent).toContain('](/docs/1.0.0/doc2#existing-docs');
  expect(transformedContent).not.toContain('](subdir/doc1.md)');
  expect(transformedContent).not.toContain('](doc2.md#existing-docs)');
  expect(content).not.toEqual(transformedContent);
});

test('transforms relative links in versioned docs', () => {
  const doc1 = path.join(version100.contentPath, 'subdir', 'doc1.md');
  const [content, transformedContent] = transform(doc1);
  expect(transformedContent).toMatchSnapshot();
  expect(transformedContent).toContain('](/docs/1.0.0/doc2');
  expect(transformedContent).not.toContain('](../doc2.md)');
  expect(content).not.toEqual(transformedContent);
});
