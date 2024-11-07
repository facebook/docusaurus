/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Plugin} from 'unified';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ContainerDirective} from 'mdast-util-directive';
import type {Parent, Root} from 'mdast';

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

type DirectiveLabel = Parent;
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
  const isTextOnlyTitle =
    directiveLabel?.children?.length === 1 &&
    directiveLabel?.children?.[0]?.type === 'text';
  return isTextOnlyTitle
    ? // @ts-expect-error: todo type
      (directiveLabel?.children?.[0].value as string)
    : undefined;
}

const plugin: Plugin<Partial<AdmonitionOptions>[], Root> = function plugin(
  this,
  optionsInput = {},
): Transformer<Root> {
  const {keywords} = normalizeAdmonitionOptions(optionsInput);

  return async (root) => {
    const {visit} = await import('unist-util-visit');

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

        // Transform the mdast directive node to a hast admonition node
        // See https://github.com/syntax-tree/mdast-util-to-hast#fields-on-nodes
        // TODO in MDX v2 we should transform the whole directive to
        // mdxJsxFlowElement instead of using hast
        node.data = {
          hName: 'admonition',
          hProperties: {
            ...(textOnlyTitle && {title: textOnlyTitle}),
            type: node.name,
          },
        };
        node.children = contentNodes;

        // TODO legacy MDX v1 <mdxAdmonitionTitle> workaround
        // v1: not possible to inject complex JSX elements as props
        // v2: now possible: use a mdxJsxFlowElement element
        if (directiveLabel && !textOnlyTitle) {
          const complexTitleNode = {
            type: 'mdxAdmonitionTitle',
            data: {
              hName: 'mdxAdmonitionTitle',
              hProperties: {},
            },
            children: directiveLabel.children,
          };
          // @ts-expect-error: invented node type
          node.children.unshift(complexTitleNode);
        }
      }
    });
  };
};

export default plugin;
