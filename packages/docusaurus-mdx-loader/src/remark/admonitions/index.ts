/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer, Processor, Plugin} from 'unified';
import type {Literal} from 'mdast';

const NEWLINE = '\n';

export type AdmonitionOptions = {
  tag: string;
  keywords: string[];
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
};

function escapeRegExp(s: string): string {
  return s.replace(/[-[\]{}()*+?.\\^$|/]/g, '\\$&');
}

function normalizeOptions(
  options: Partial<AdmonitionOptions>,
): AdmonitionOptions {
  return {...DefaultAdmonitionOptions, ...options};
}

// This string value does not matter much
// It is ignored because nodes are using hName/hProperties coming from HAST
const admonitionNodeType = 'admonitionHTML';

const plugin: Plugin = function plugin(
  this: Processor,
  optionsInput: Partial<AdmonitionOptions> = {},
): Transformer {
  const options = normalizeOptions(optionsInput);

  const keywords = Object.values(options.keywords).map(escapeRegExp).join('|');
  const tag = escapeRegExp(options.tag);
  const regex = new RegExp(`${tag}(${keywords})(?: *(.*))?\n`);
  const escapeTag = new RegExp(escapeRegExp(`\\${options.tag}`), 'g');

  // The tokenizer is called on blocks to determine if there is an admonition
  // present and create tags for it
  function blockTokenizer(this: any, eat: any, value: string, silent: boolean) {
    // Stop if no match or match does not start at beginning of line
    const match = regex.exec(value);
    if (!match || match.index !== 0) {
      return false;
    }
    // If silent return the match
    if (silent) {
      return true;
    }

    const now = eat.now();
    const [opening, keyword, title] = match as string[] as [
      string,
      string,
      string,
    ];
    const food = [];
    const content = [];

    let newValue = value;
    // consume lines until a closing tag
    let idx = newValue.indexOf(NEWLINE);
    while (idx !== -1) {
      // grab this line and eat it
      const next = newValue.indexOf(NEWLINE, idx + 1);
      const line =
        next !== -1 ? newValue.slice(idx + 1, next) : newValue.slice(idx + 1);
      food.push(line);
      newValue = newValue.slice(idx + 1);
      // the closing tag is NOT part of the content
      if (line.startsWith(options.tag)) {
        break;
      }
      content.push(line);
      idx = newValue.indexOf(NEWLINE);
    }

    // consume the processed tag and replace escape sequences
    const contentString = content.join(NEWLINE).replace(escapeTag, options.tag);
    const add = eat(opening + food.join(NEWLINE));

    // parse the content in block mode
    const exit = this.enterBlock();
    const contentNodes = this.tokenizeBlock(contentString, now);
    exit();

    const titleNodes = this.tokenizeInline(title, now);

    const isSimpleTextTitle =
      titleNodes.length === 1 && titleNodes[0].type === 'text';

    const element = {
      type: admonitionNodeType,
      data: {
        // hName/hProperties come from HAST
        // See https://github.com/syntax-tree/mdast-util-to-hast#fields-on-nodes
        hName: 'admonition',
        hProperties: {
          ...(title && isSimpleTextTitle && {title}),
          type: keyword,
        },
      },
      children: [
        // For titles containing MDX syntax: create a custom element. The theme
        // component will extract it and render it nicely.
        //
        // Temporary workaround, because it's complex in MDX v1 to emit
        // interpolated JSX prop syntax (title={<>my <code>title</code></>}).
        // For this reason, we use children instead of the title prop.
        title &&
          !isSimpleTextTitle && {
            type: admonitionNodeType,
            data: {
              hName: 'mdxAdmonitionTitle',
              hProperties: {},
            },
            children: titleNodes,
          },
        ...contentNodes,
      ].filter(Boolean),
    };

    return add(element);
  }

  // add tokenizer to parser after fenced code blocks
  const Parser = this.Parser.prototype;
  Parser.blockTokenizers.admonition = blockTokenizer;
  Parser.blockMethods.splice(
    Parser.blockMethods.indexOf('fencedCode') + 1,
    0,
    'admonition',
  );
  Parser.interruptParagraph.splice(
    Parser.interruptParagraph.indexOf('fencedCode') + 1,
    0,
    ['admonition'],
  );
  Parser.interruptList.splice(
    Parser.interruptList.indexOf('fencedCode') + 1,
    0,
    ['admonition'],
  );
  Parser.interruptBlockquote.splice(
    Parser.interruptBlockquote.indexOf('fencedCode') + 1,
    0,
    ['admonition'],
  );

  return (root) => {
    // escape everything except admonitionHTML nodes
    visit(
      root,
      (node: unknown): node is Literal =>
        (node as Literal | undefined)?.type !== admonitionNodeType,
      (node: Literal) => {
        if (node.value) {
          node.value = node.value.replace(escapeTag, options.tag);
        }
      },
    );
  };
};

export default plugin;
