/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import visit from 'unist-util-visit';
import type {Transformer, Processor, Plugin} from 'unified';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ContainerDirective} from 'mdast-util-directive';

// TODO not ideal option shape
// First let upgrade to MDX 2.0
// Maybe we'll want to provide different tags for different admonition types?
// Also maybe rename "keywords" to "types"?
export type AdmonitionOptions = {
  tag: string; // TODO remove this config option, now unused with md directives
  keywords: string[];
  extendDefaults: boolean;
};

export const DefaultAdmonitionOptions: AdmonitionOptions = {
  tag: ':::',
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
  extendDefaults: false, // TODO make it true by default: breaking change
};

function normalizeOptions(
  providedOptions: Partial<AdmonitionOptions>,
): AdmonitionOptions {
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

// This string value does not matter much
// It is ignored because nodes are using hName/hProperties coming from HAST
// const admonitionNodeType = 'admonitionHTML';

const plugin: Plugin = function plugin(
  this: Processor,
  optionsInput: Partial<AdmonitionOptions> = {},
): Transformer {
  const {keywords} = normalizeOptions(optionsInput);

  // See also:
  // https://talk.commonmark.org/t/generic-directives-plugins-syntax/444
  // https://github.com/remarkjs/remark-directive
  return async (tree, file) => {
    const {h} = await import('hastscript');

    visit(tree, 'containerDirective', (directive: ContainerDirective) => {
      const isAdmonition = keywords.includes(directive.name);

      if (!isAdmonition) {
        return;
      }

      const data = directive.data || (directive.data = {});
      const tagName = 'admonition';

      const hasDirectiveLabel =
        directive.children?.[0].data?.directiveLabel === true;

      // TODO this is our old MDX v1 <mdxAdmonitionTitle> workaround
      // in v2 we should transform the whole directive to mdxJsxFlowElement
      if (hasDirectiveLabel) {
        const directiveLabel = directive.children[0];
        directiveLabel.data.hName = 'mdxAdmonitionTitle';
        directiveLabel.data.hProperties = directiveLabel.data.hProperties ?? {};
        directiveLabel.data.hProperties.mdxType = 'mdxAdmonitionTitle';
      }

      data.hName = tagName;
      data.hProperties = h(tagName, {
        ...directive.attributes,
        type: directive.name,
        title: directive.attributes?.title,
      }).properties;
    });
  };
};

export default plugin;
