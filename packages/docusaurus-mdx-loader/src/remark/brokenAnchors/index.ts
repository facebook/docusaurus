/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import logger from '@docusaurus/logger';
import type {Heading, Link, Text} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const nodeTypes: ['heading', 'link'] = ['heading', 'link'];

type AnchorList = {
  links: {link: {url?: string; anchor?: string}}[];
  headings: {heading: {text: string}}[];
};

type NodeAnchorList = {
  nodes: AnchorList;
  filePath: string;
};

function isValidURL(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function checkAnchor(anchor: NodeAnchorList) {
  const {links, headings} = anchor.nodes;

  const invalidAnchor: string[] = [];

  const headingsText = headings.map((heading) =>
    heading.heading.text.toLowerCase(),
  );

  // filter out the anchor that has a url (pointing to another .md file)
  const linkAnchor = links.filter((link) => link.link.url === undefined);

  linkAnchor.forEach((el) => {
    // if the anchor is undefined, then skip
    if (
      el.link.anchor &&
      !headingsText.includes(el.link.anchor.toLowerCase())
    ) {
      invalidAnchor.push(el.link.anchor);
    }
  });

  if (invalidAnchor.length > 0) {
    const anchorLength = logger.interpolate`number=${invalidAnchor.length}`;
    const filePath = logger.interpolate`path=${anchor.filePath}`;
    const invalidAnchors = invalidAnchor.join(', ');
    logger.warn`Docusaurus found ${anchorLength} broken anchor(s) in file ${filePath}:\n${invalidAnchors}`;
  }
}

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return async (tree, file) => {
    const {visit} = await import('unist-util-visit');

    const anchorList: AnchorList = {links: [], headings: []};
    visit<Parent, ['heading', 'link']>(
      tree,
      nodeTypes,
      (directive: Heading | Link) => {
        // we want only markdown links
        if (directive.type === 'link' && isValidURL(directive?.url)) {
          return;
        }

        // if the heading is empty then skip
        if (directive.type === 'heading' && directive.children.length !== 0) {
          // if the heading is a link, then check the anchor
          const childNode = directive.children[0] as Link | Text;
          if (childNode?.type === 'link' && childNode.children.length !== 0) {
            const linkTextValue = childNode.children[0] as any;
            anchorList.headings.push({
              heading: {text: linkTextValue.value.replaceAll(' ', '-')},
            });
          } else if (childNode?.type === 'text') {
            anchorList.headings.push({
              heading: {
                text: childNode.value.replaceAll(' ', '-'),
              },
            });
          }
        }

        // get the URL of link nodes
        if (directive.type === 'link') {
          // check if link isn't empty
          // ? should we report empty links?
          if (directive.children.length !== 0) {
            const linkUrlValue = directive.url;
            const [url, anchor] = linkUrlValue.split('#');
            anchorList.links.push({
              link: {
                url: url === '' ? undefined : url,
                anchor: anchor === '' ? undefined : anchor,
              },
            });
          }
        }
      },
    );

    // We only enable these warnings for the client compiler
    // This avoids emitting duplicate warnings in prod mode
    // Note: the client compiler is used in both dev/prod modes
    if (file.data.compilerName === 'client') {
      checkAnchor({
        nodes: anchorList,
        filePath: file.path,
      });
    }
  };
};

export default plugin;
