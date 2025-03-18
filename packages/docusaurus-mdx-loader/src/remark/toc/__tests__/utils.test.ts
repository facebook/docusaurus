/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toHeadingHTMLValue} from '../utils';
import type {Heading} from 'mdast';

describe('toHeadingHTMLValue', () => {
  async function convert(heading: Heading): Promise<string> {
    const {toString} = await import('mdast-util-to-string');
    return toHeadingHTMLValue(heading, toString);
  }

  it('converts a simple heading', async () => {
    const heading: Heading = {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'Some heading text',
        },
      ],
    };

    await expect(convert(heading)).resolves.toMatchInlineSnapshot(
      `"Some heading text"`,
    );
  });

  it('converts a heading with b tag', async () => {
    const heading: Heading = {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'mdxJsxTextElement',
          name: 'b',
          attributes: [],
          children: [
            {
              type: 'text',
              value: 'Some title',
            },
          ],
        },
      ],
    };

    await expect(convert(heading)).resolves.toMatchInlineSnapshot(
      `"<b>Some title</b>"`,
    );
  });

  it('converts a heading with span tag + className', async () => {
    const heading: Heading = {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'mdxJsxTextElement',
          name: 'span',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'className',
              value: 'my-class',
            },
          ],
          children: [
            {
              type: 'text',
              value: 'Some title',
            },
          ],
        },
      ],
    };

    await expect(convert(heading)).resolves.toMatchInlineSnapshot(
      `"<span class="my-class">Some title</span>"`,
    );
  });

  it('converts a heading - remove img tag', async () => {
    const heading: Heading = {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'mdxJsxTextElement',
          name: 'img',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'src',
              value: '/img/slash-introducing.svg',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'height',
              value: '32',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'alt',
              value: 'test',
            },
          ],
          children: [],
        },
        {
          type: 'text',
          value: ' Some title',
        },
      ],
    };

    await expect(convert(heading)).resolves.toMatchInlineSnapshot(
      `"Some title"`,
    );
  });
});
