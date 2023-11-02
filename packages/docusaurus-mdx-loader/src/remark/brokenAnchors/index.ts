/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {Heading, Link} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const directiveTypes: ['heading', 'link'] = ['heading', 'link'];

type AnchorList = any;

function isValidURL(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function checkAnchor(anchor: AnchorList) {
  const {links, headings} = anchor.nodes;

  const invalidAnchor: any = [];

  console.log(links, headings);
  const headingsText = headings.map((heading: any) =>
    heading.heading.text.toLowerCase(),
  );

  const linkAnchor = links.filter((link: any) => link.link.url === undefined);

  linkAnchor.forEach((el: any) => {
    // if the anchor is undefined, then skip
    console.log(el);
    if (
      el.link.anchor &&
      !headingsText.includes(el.link.anchor.toLowerCase())
    ) {
      invalidAnchor.push(el.link.anchor);
    }
  });

  if (invalidAnchor.length !== 0) {
    console.warn(
      `Docusaurus found ${invalidAnchor.length} broken anchor links in ${
        anchor.filePath
      }\n${invalidAnchor.join(', ')}`,
    );
  }
}

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return async (tree, file) => {
    const {visit} = await import('unist-util-visit');

    const anchorList: AnchorList = {links: [], headings: []};

    visit<Parent, ['heading', 'link']>(
      tree,
      directiveTypes,
      (directive: Heading | Link) => {
        // we want only markdown links
        if (directive.type === 'link' && isValidURL(directive?.url)) {
          return;
        }

        if (directive.type === 'heading') {
          const headingNode = directive;
          // if the heading is empty then skip
          if (headingNode.children.length === 0) {
            return;
          }

          // if the heading is a link, then check the anchor
          if (headingNode.children[0]?.type === 'link') {
            const linkNode = headingNode.children[0] as Link;

            if (linkNode.children.length !== 0) {
              const linkTextValue =
                linkNode.children[0]?.type === 'text'
                  ? linkNode.children[0].value
                  : '';
              anchorList.headings.push({
                heading: {text: linkTextValue, depth: headingNode.depth},
              });
            }
          } else if (headingNode.children[0]?.type === 'text') {
            const textNode = headingNode.children[0];
            anchorList.headings.push({
              heading: {
                text: textNode.value.replaceAll(' ', '-'),
                depth: headingNode.depth,
              },
            });
          }
        }

        // get the URL of link nodes
        if (directive.type === 'link') {
          const linkNode = directive as Link;

          // check if link isn't empty
          // should we report empty links?
          if (linkNode.children.length !== 0) {
            const linkUrlValue = linkNode.url;
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
    // if (file.data.compilerName === 'client') {
    //   console.warn({
    //     directives: unusedDirectives,
    //     filePath: file.path,
    //   });
    // }
    checkAnchor({
      nodes: anchorList,
      filePath: file.path,
    });
  };
};

export default plugin;
