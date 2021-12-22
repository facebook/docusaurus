/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import matter from 'gray-matter';
import remark from 'remark';
import mdx from 'remark-mdx';
import visit from 'unist-util-visit';
import type {Node, Parent} from 'unist';
import type {Heading, Text, Image, Paragraph} from 'mdast';
import type {Plugin} from 'unified';

const isImage = (node: Node): node is Image => node.type === 'image';
const isHeading = (node: Node): node is Heading => node.type === 'heading';
const isParagraph = (node: Node): node is Paragraph =>
  node.type === 'paragraph';
const isText = (node: Node): node is Text => node.type === 'text';

// Input: ## Some heading {#some-heading}
// Output: {text: "## Some heading", id: "some-heading"}
export function parseMarkdownHeadingId(heading: string): {
  text: string;
  id?: string;
} {
  const customHeadingIdRegex = /^(.*?)\s*\{#([\w-]+)\}$/;
  const matches = customHeadingIdRegex.exec(heading);
  if (matches) {
    return {
      text: matches[1],
      id: matches[2],
    };
  } else {
    return {text: heading, id: undefined};
  }
}

function toText(node: Node): string {
  let excerpt = '';
  visit(node, ['text', 'inlineCode'], (child, index, parent) => {
    if (parent?.type !== 'linkReference') {
      excerpt += (child as Text).value;
    }
  });
  return excerpt;
}

type MarkdownParserOptions = {
  remarkPlugins?: Plugin[];
  removeContentTitle?: boolean;
};

export function createExcerpt(
  fileString: string,
  options: MarkdownParserOptions = {remarkPlugins: []},
): string | undefined {
  const {remarkPlugins = []} = options;
  const mdast = remark().use(mdx).use(remarkPlugins).parse(fileString);
  let excerpt = '';
  visit(
    mdast,
    ['paragraph', 'heading', 'image'],
    (node: Paragraph | Heading | Image) => {
      const isAdmonitionFence =
        isParagraph(node) &&
        isText(node.children[0]) &&
        node.children[0].value.startsWith(':::');
      const isMainHeading = isHeading(node) && node.depth === 1;
      if (isAdmonitionFence || isMainHeading) {
        return true;
      }
      if (isImage(node)) {
        if (node.alt) {
          excerpt = node.alt;
          // Already obtained the excerpt; stop traversal
          return false;
        }
      } else if (!isHeading(node) || node.depth > 1) {
        excerpt = toText(node);
        if (isHeading(node)) {
          excerpt = parseMarkdownHeadingId(excerpt).text;
        }
        if (excerpt) {
          return false;
        }
      }
      return true;
    },
  );

  return excerpt || undefined;
}

export function parseFrontMatter(markdownFileContent: string): {
  frontMatter: Record<string, unknown>;
  content: string;
} {
  const {data, content} = matter(markdownFileContent);
  return {
    frontMatter: data ?? {},
    content: content?.trim() ?? '',
  };
}

export function parseMarkdownContentTitle(
  contentUntrimmed: string,
  options: MarkdownParserOptions = {
    removeContentTitle: false,
    remarkPlugins: [],
  },
): {content: string; contentTitle: string | undefined} {
  const {removeContentTitle = false} = options;
  let content = contentUntrimmed.trim();

  const mdast = remark()
    .use(mdx)
    // .use(remarkPlugins) // We don't pass plugins here. Let's see if there's any use-case where this is useful
    .parse(content);

  let contentTitle: string | undefined;
  // console.log(JSON.stringify(mdast, null, 2));
  const firstConcreteNode = (mdast as Parent)?.children.find(
    (child) => child.type !== 'import' && child.type !== 'export',
  );
  if (
    firstConcreteNode &&
    isHeading(firstConcreteNode) &&
    firstConcreteNode.depth === 1
  ) {
    contentTitle = parseMarkdownHeadingId(toText(firstConcreteNode)).text;
    if (removeContentTitle) {
      const {
        start: {line: startLine},
        end: {line: endLine},
      } = firstConcreteNode.position!;
      const lines = content.split('\n');
      lines.splice(startLine - 1, endLine - startLine + 1);
      content = lines.join('\n');
    }
  }
  return {content: content.trim(), contentTitle};
}

type ParsedMarkdown = {
  frontMatter: Record<string, unknown>;
  content: string;
  contentTitle: string | undefined;
  excerpt: string | undefined;
};

export function parseMarkdownString(
  markdownFileContent: string,
  options?: MarkdownParserOptions,
): ParsedMarkdown {
  try {
    const {frontMatter, content: contentWithoutFrontMatter} =
      parseFrontMatter(markdownFileContent);

    const {content, contentTitle} = parseMarkdownContentTitle(
      contentWithoutFrontMatter,
      options,
    );

    const excerpt = createExcerpt(content, options);

    return {
      frontMatter,
      content,
      contentTitle,
      excerpt,
    };
  } catch (e) {
    logger.error(`Error while parsing Markdown frontmatter.
This can happen if you use special characters in frontmatter values (try using double quotes around that value).`);
    throw e;
  }
}

export async function parseMarkdownFile(
  source: string,
  options?: MarkdownParserOptions,
): Promise<ParsedMarkdown> {
  const markdownString = await fs.readFile(source, 'utf-8');
  try {
    return parseMarkdownString(markdownString, options);
  } catch (e) {
    throw new Error(
      `Error while parsing Markdown file ${source}: "${(e as Error).message}".`,
    );
  }
}
