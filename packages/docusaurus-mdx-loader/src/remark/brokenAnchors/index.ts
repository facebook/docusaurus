/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import process from 'process';
import logger from '@docusaurus/logger';
import {posixPath} from '@docusaurus/utils';
import type {Heading, Link, Text} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const nodeTypes: ['heading', 'link'] = ['heading', 'link'];

type NodeType = {
  heading: 'heading';
  link: 'link';
  text: 'text';
};

const nodeType: NodeType = {
  heading: 'heading',
  link: 'link',
  text: 'text',
};

type LinkAnchor = {
  link: {
    url: string | undefined;
    anchor: string | undefined;
  };
};

type HeadingAnchor = {
  heading: {
    text: string;
  };
};

type AnchorList = {
  links: LinkAnchor[];
  headings: HeadingAnchor[];
};

type NodeAnchorList = {
  nodes: AnchorList;
  filePath: string;
};

/**
 * Check if a URL is valid based on its protocol.
 *
 * @param {string} url - URL to validate.
 * @returns {boolean} - Returns `true` if the URL is valid, `false` if it's invalid.
 *
 * Example:
 *   - Returns `true` if the URL has an invalid protocol, e.g., "http://www.example.com"
 *   - Returns `false` if the URL has a custom protocol, e.g., "docs:///path/to/file.txt"
 */
function isValidURL(url: string): boolean {
  const invalidProtocols = [
    'http:',
    'https:',
    'ftp:',
    'ftps:',
    'mailto:',
    'tel:',
    'sms:',
  ];
  const customProtocols = ['docs:', 'file:'];
  try {
    const {protocol} = new URL(url);

    if (invalidProtocols.includes(protocol)) {
      return true;
    } else if (customProtocols.includes(protocol)) {
      return false;
    }
    return false;
  } catch {
    // if there is a problem with the URL, then it's not valid
    // eg. empty string, url with no protocol
    return false;
  }
}

function logBrokenAnchorWarning(nodeAnchor: NodeAnchorList) {
  const {links, headings} = nodeAnchor.nodes;
  const {filePath} = nodeAnchor;
  const headingsText = headings.map((heading) =>
    heading.heading.text.toLowerCase(),
  );

  const invalidAnchors = links
    .filter((link) => link.link.url === undefined)
    .filter(
      (el) =>
        el.link.anchor && !headingsText.includes(el.link.anchor.toLowerCase()),
    )
    .map((el) => el.link.anchor);

  if (invalidAnchors.length > 0) {
    const numInvalidAnchors = logger.interpolate`number=${invalidAnchors.length}`;
    const customPath = posixPath(path.relative(process.cwd(), filePath));
    const fileLog = logger.interpolate`path=${customPath}`;
    const invalidAnchorList = invalidAnchors
      .map(formatAnchorMessage)
      .join('\n');
    logger.warn`Docusaurus found ${numInvalidAnchors} broken anchor in file ${fileLog}
${invalidAnchorList}`;
  }
}

function formatAnchorMessage(str: string | undefined) {
  return `- #${str}`;
}

function stringToAnchor(string: string) {
  return string.replaceAll(' ', '-');
}

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return async (tree, file) => {
    const {visit} = await import('unist-util-visit');

    const anchorList: AnchorList = {links: [], headings: []};
    visit<Parent, ['heading', 'link']>(
      tree,
      nodeTypes,
      (directive: Heading | Link) => {
        // we only want to check custom protocols (eg. docs:, file:)
        // and string that are considered as file (eg. file.md, google.com)
        // and invalid protocols (eg. http:, https:, ftp:, etc.)
        if (
          (directive.type === 'link' && isValidURL(directive?.url)) ||
          directive.children.length === 0
        ) {
          return;
        }

        if (directive.type === nodeType.heading) {
          const childNode = directive.children[0] as Link | Text;

          // if the heading is a link, then check the anchor
          if (childNode?.type === nodeType.link) {
            const linkTextValue = childNode.children[0] as any;
            anchorList.headings.push({
              heading: {text: stringToAnchor(linkTextValue.value)},
            });
          } else if (childNode?.type === nodeType.text) {
            anchorList.headings.push({
              heading: {
                text: stringToAnchor(childNode.value),
              },
            });
          }
        }

        // check if link isn't empty
        // ? should we report empty links?
        if (directive.type === nodeType.link) {
          const [url, anchor] = directive.url.split('#');
          anchorList.links.push({
            link: {
              url: url === '' ? undefined : url,
              anchor: anchor === '' ? undefined : anchor,
            },
          });
        }
      },
    );

    // We only enable these warnings for the client compiler
    // This avoids emitting duplicate warnings in prod mode
    // Note: the client compiler is used in both dev/prod modes
    if (file.data.compilerName === 'client') {
      logBrokenAnchorWarning({
        nodes: anchorList,
        filePath: file.path,
      });
    }
  };
};

export default plugin;
