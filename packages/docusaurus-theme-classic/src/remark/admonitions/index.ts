/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */

import type {Transformer} from 'unified';
import visit from 'unist-util-visit';

const NEWLINE = '\n';

const config = {
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
  return s.replace(new RegExp(`[-[\\]{}()*+?.\\\\^$|/]`, 'g'), '\\$&');
}

export default function plugin(this: any): Transformer {
  const keywords = Object.values(config.keywords).map(escapeRegExp).join('|');
  const tag = escapeRegExp(config.tag);
  const regex = new RegExp(`${tag}(${keywords})(?: *(.*))?\n`);
  const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), 'g');

  // the tokenizer is called on blocks to determine if there is an admonition present and create tags for it
  function blockTokenizer(this: any, eat: any, value: string, silent: boolean) {
    // stop if no match or match does not start at beginning of line
    const match = regex.exec(value);
    if (!match || match.index !== 0) return false;
    // if silent return the match
    if (silent) return true;

    const now = eat.now();
    const [opening, keyword, title] = match;
    const food = [];
    const content = [];

    // consume lines until a closing tag
    let idx = 0;
    while ((idx = value.indexOf(NEWLINE)) !== -1) {
      // grab this line and eat it
      const next = value.indexOf(NEWLINE, idx + 1);
      const line =
        next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1);
      food.push(line);
      value = value.slice(idx + 1);
      // the closing tag is NOT part of the content
      if (line.startsWith(config.tag)) break;
      content.push(line);
    }

    // consume the processed tag and replace escape sequences
    const contentString = content.join(NEWLINE).replace(escapeTag, config.tag);
    const add = eat(opening + food.join(NEWLINE));

    // parse the content in block mode
    const exit = this.enterBlock();
    const contentNodes = this.tokenizeBlock(contentString, now);
    exit();

    const element = {
      type: 'admonitionHTML',
      data: {
        hName: 'admonition',
        hProperties: {
          title,
          type: keyword,
        },
      },
      children: contentNodes,
    };

    return add(element);
  }

  // add tokenizer to parser after fenced code blocks
  const Parser = (this as any).Parser.prototype;
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

  return function transformer(tree) {
    // escape everything except admonitionHTML nodes
    // @ts-ignore FIXME
    visit(
      tree,
      (node: any) => {
        return node.type !== 'admonitionHTML';
      },
      function visitor(node: any) {
        if (node.value) {
          node.value = node.value.replace(escapeTag, config.tag);
        }
        return node;
      },
    );
  };
}
