/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {visit} from 'unist-util-visit';
import {transformNode} from '../utils';
import type {Transformer, Plugin} from 'unified';
import type {ContainerDirective} from 'mdast-util-directive';
import type {Paragraph, Root} from 'mdast';
import type {MdxJsxFlowElement, MdxJsxTextElement} from 'mdast-util-mdx';

export type AdmonitionOptions = {
  keywords: string[];
  extendDefaults: boolean;
};

export const DefaultAdmonitionOptions: AdmonitionOptions = {
  keywords: [
    'secondary',
    'info',
    'success',
    'danger',
    'note',
    'tip',
    'warning',
    'important',
    'caution',
  ],
  extendDefaults: true,
};

export function normalizeAdmonitionOptions(
  providedOptions: Partial<AdmonitionOptions> | true,
): AdmonitionOptions {
  if (providedOptions === true) {
    return DefaultAdmonitionOptions;
  }

  const options = {...DefaultAdmonitionOptions, ...providedOptions};

  // By default it makes more sense to append keywords to the default ones
  // Adding custom keywords is more common than disabling existing ones
  if (options.extendDefaults) {
    options.keywords = [
      ...DefaultAdmonitionOptions.keywords,
      ...options.keywords,
    ];
  }

  return options;
}

type DirectiveLabel = Paragraph;
type DirectiveContent = ContainerDirective['children'];

function parseDirective(directive: ContainerDirective): {
  directiveLabel: DirectiveLabel | undefined;
  contentNodes: DirectiveContent;
} {
  const hasDirectiveLabel =
    // @ts-expect-error: fine
    directive.children?.[0]?.data?.directiveLabel === true;
  if (hasDirectiveLabel) {
    const [directiveLabel, ...contentNodes] = directive.children;
    return {directiveLabel: directiveLabel as DirectiveLabel, contentNodes};
  }
  return {directiveLabel: undefined, contentNodes: directive.children};
}

function getTextOnlyTitle(directiveLabel: DirectiveLabel): string | undefined {
  const [child] = directiveLabel.children;
  return directiveLabel.children.length === 1 && child?.type === 'text'
    ? child.value
    : undefined;
}

const plugin: Plugin<Partial<AdmonitionOptions>[], Root> = function plugin(
  this,
  optionsInput = {},
): Transformer<Root> {
  const {keywords} = normalizeAdmonitionOptions(optionsInput);

  return (root) => {
    visit(root, (node) => {
      if (node.type === 'containerDirective') {
        const isAdmonition = keywords.includes(node.name);

        if (!isAdmonition) {
          return;
        }

        const {directiveLabel, contentNodes} = parseDirective(node);

        const textOnlyTitle =
          node.attributes?.title ??
          (directiveLabel ? getTextOnlyTitle(directiveLabel) : undefined);

        const properties = {
          ...(textOnlyTitle && {title: textOnlyTitle}),
          ...(node.attributes?.class && {className: node.attributes.class}),
          ...(node.attributes?.id && {id: node.attributes.id}),
          type: node.name,
        };
        const admonition: MdxJsxFlowElement = {
          type: 'mdxJsxFlowElement',
          name: 'Admonition',
          attributes: Object.entries(properties).map(([name, value]) => ({
            type: 'mdxJsxAttribute',
            name,
            value,
          })),
          children: contentNodes,
          position: node.position,
        };

        // Keep rich titles in the tree for subsequent remark/rehype plugins.
        // The final rehype plugin moves this fragment into the title prop.
        if (directiveLabel?.children.length && !textOnlyTitle) {
          const complexTitleNode: MdxJsxTextElement = {
            type: 'mdxJsxTextElement',
            name: null,
            attributes: [],
            data: {admonitionTitle: true},
            children: directiveLabel.children,
            position: directiveLabel.position,
          };
          // MDX supports inline JSX here without an extra paragraph wrapper.
          // @ts-expect-error: JSX flow children are typed as block content only
          admonition.children.unshift(complexTitleNode);
        }

        transformNode(node, admonition);
      }
    });
  };
};

export default plugin;
