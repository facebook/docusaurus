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

/*
const isMdxEsmLiteral = (node: Node): node is Literal =>
  node.type === 'mdxjsEsm';
// TODO good-enough approximation, but not 100% accurate
const isAdmonitionImport = (node: Node): boolean =>
  isMdxEsmLiteral(node) && node.value.includes('@theme/Admonition');

function createImportNode() {
  return {
    type: 'mdxjsEsm',
    value: "import Admonition from '@theme/Admonition'",
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'Admonition'},
              },
            ],
            source: {
              type: 'Literal',
              value: '@theme/Admonition',
              raw: "'@theme/Admonition'",
            },
          },
        ],
        sourceType: 'module',
      },
    },
  };
}

function createAdmonitionNode({
  directive,
  title,
  children,
}: {
  directive: ContainerDirective;
  title: unknown;
  children: unknown;
}) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'Admonition',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'type',
        value: directive.name,
      },
      {
        type: 'mdxJsxAttribute',
        name: 'title',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          // TODO this is the complex part I couldn't solve  :/
          value: mdHastToValueExpression(title),
        },
      },
    ],
    children,
  };
}
 */

function extractDirectiveLabel(directive: ContainerDirective) {
  const hasDirectiveLabel =
    directive.children?.[0].data?.directiveLabel === true;
  if (hasDirectiveLabel) {
    const [directiveLabel, ...children] = directive.children;
    return {directiveLabel, children};
  }
  return {directiveLabel: undefined, children: directive.children};
}

// This string value does not matter much
// It is ignored because nodes are using hName/hProperties coming from HAST
// const admonitionNodeType = 'admonitionHTML';

const plugin: Plugin = function plugin(
  this: Processor,
  optionsInput: Partial<AdmonitionOptions> = {},
): Transformer {
  const {keywords} = normalizeAdmonitionOptions(optionsInput);

  // See also:
  // https://talk.commonmark.org/t/generic-directives-plugins-syntax/444
  // https://github.com/remarkjs/remark-directive
  return async (root) => {
    /*
    let transformed = false;
    let alreadyImported = false;
     */

    visit(root, (node) => {
      /*
      if (isAdmonitionImport(node)) {
        alreadyImported = true;
      }
       */

      if (node.type === 'containerDirective') {
        // transformed = true;

        const directive = node as ContainerDirective;
        const isAdmonition = keywords.includes(directive.name);

        if (!isAdmonition) {
          return;
        }

        const {directiveLabel, children} = extractDirectiveLabel(directive);

        /*
        // :::tip{title="my title} overrides :::tip[my title]
        const title = directive.attributes?.title ?? directiveLabel?.children;

        const admonitionNode = createAdmonitionNode({
          directive,
          title,
          children,
        });

        parent!.children.splice(index, 1, admonitionNode);

         */

        // TODO in MDX v2 we should transform the whole directive to
        // mdxJsxFlowElement instead of using hast
        directive.data ??= {};
        directive.data.hName = 'admonition';
        directive.data.hProperties = {
          ...directive.attributes,
          type: directive.name,
          title: directive.attributes?.title,
        };

        // TODO legacy MDX v1 <mdxAdmonitionTitle> workaround
        // Because it wasn't possible to inject JSX elements as props in v1
        // in v2 we should transform the whole directive to mdxJsxFlowElement
        // not so easy :/
        if (directiveLabel) {
          directiveLabel.data.hName = 'mdxAdmonitionTitle';
          directiveLabel.data.hProperties =
            directiveLabel.data.hProperties ?? {};
          directiveLabel.data.hProperties.mdxType = 'mdxAdmonitionTitle';
        }
      }
    });

    /*
    if (transformed && !alreadyImported) {
      (root as Parent).children.unshift(createImportNode());
    }
     */
  };
};

export default plugin;
