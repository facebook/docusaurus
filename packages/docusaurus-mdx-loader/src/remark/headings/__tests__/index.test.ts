/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

import u from 'unist-builder';
import {removePosition} from 'unist-util-remove-position';
import {toString} from 'mdast-util-to-string';
import {visit} from 'unist-util-visit';
import {escapeMarkdownHeadingIds} from '@docusaurus/utils';
import plugin from '../index';
import type {PluginOptions} from '../index';
import type {Plugin} from 'unified';
import type {Parent} from 'unist';
import type {Root} from 'mdast';

async function process(
  input: string,
  plugins: Plugin[] = [],
  options: PluginOptions = {anchorsMaintainCase: false},
  format: 'md' | 'mdx' = 'mdx',
): Promise<Root> {
  const {remark} = await import('remark');

  let content = input;
  let formatPlugins: Plugin[] = [];

  if (format === 'mdx') {
    const {default: mdx} = await import('remark-mdx');
    // Preprocess the input to support our invalid heading ids syntax
    content = escapeMarkdownHeadingIds(input);
    formatPlugins = [mdx];
  }

  const processor = remark().use({
    plugins: [...formatPlugins, ...plugins, [plugin, options]],
  });

  const result = await processor.run(processor.parse(content));
  removePosition(result, {force: true});

  return result as unknown as Root;
}

function heading(label: string | null, id: string) {
  return u(
    'heading',
    {depth: 2, data: {id, hProperties: {id}}},
    label ? [u('text', label)] : [],
  );
}

describe('headings remark plugin', () => {
  it('patches `id`s and `data.hProperties.id', async () => {
    const result = await process('# Normal\n\n## Table of Contents\n\n# Baz\n');
    const expected = u('root', [
      u(
        'heading',
        {depth: 1, data: {hProperties: {id: 'normal'}, id: 'normal'}},
        [u('text', 'Normal')],
      ),
      u(
        'heading',
        {
          depth: 2,
          data: {
            hProperties: {id: 'table-of-contents'},
            id: 'table-of-contents',
          },
        },
        [u('text', 'Table of Contents')],
      ),
      u('heading', {depth: 1, data: {hProperties: {id: 'baz'}, id: 'baz'}}, [
        u('text', 'Baz'),
      ]),
    ]);

    expect(result).toEqual(expected);
  });

  it('does not overwrite `data` on headings', async () => {
    const result = await process('# Normal\n', [
      () => (root) => {
        (root as Parent).children[0]!.data = {foo: 'bar'};
      },
    ]);
    const expected = u('root', [
      u(
        'heading',
        {
          depth: 1,
          data: {foo: 'bar', hProperties: {id: 'normal'}, id: 'normal'},
        },
        [u('text', 'Normal')],
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('does not overwrite `data.hProperties` on headings', async () => {
    const result = await process('# Normal\n', [
      () => (root) => {
        (root as Parent).children[0]!.data = {
          hProperties: {className: ['foo']},
        };
      },
    ]);
    const expected = u('root', [
      u(
        'heading',
        {
          depth: 1,
          data: {hProperties: {className: ['foo'], id: 'normal'}, id: 'normal'},
        },
        [u('text', 'Normal')],
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('generates `id`s and `hProperties.id`s, based on `hProperties.id` if they exist', async () => {
    const result = await process(
      [
        '## Something',
        '## Something here',
        '## Something there',
        '## Something also',
      ].join('\n\n'),
      [
        () => (root) => {
          (root as Parent).children[1]!.data = {hProperties: {id: 'here'}};
          (root as Parent).children[3]!.data = {hProperties: {id: 'something'}};
        },
      ],
    );
    const expected = u('root', [
      u(
        'heading',
        {
          depth: 2,
          data: {hProperties: {id: 'something'}, id: 'something'},
        },
        [u('text', 'Something')],
      ),
      u(
        'heading',
        {
          depth: 2,
          data: {hProperties: {id: 'here'}, id: 'here'},
        },
        [u('text', 'Something here')],
      ),
      u(
        'heading',
        {
          depth: 2,
          data: {hProperties: {id: 'something-there'}, id: 'something-there'},
        },
        [u('text', 'Something there')],
      ),
      u(
        'heading',
        {
          depth: 2,
          data: {hProperties: {id: 'something-1'}, id: 'something-1'},
        },
        [u('text', 'Something also')],
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('creates GitHub-style headings ids', async () => {
    const result = await process(
      [
        '## I ♥ unicode',
        '',
        '## Dash-dash',
        '',
        '## en–dash',
        '',
        '## em–dash',
        '',
        '## 😄 unicode emoji',
        '',
        '## 😄-😄 unicode emoji',
        '',
        '## 😄_😄 unicode emoji',
        '',
        '##',
        '',
        '## ',
        '',
        '##     Initial spaces',
        '',
        '## Final spaces   ',
        '',
        '## Duplicate',
        '',
        '## Duplicate',
        '',
        '## :ok: No underscore',
        '',
        '## :ok_hand: Single',
        '',
        '## :ok_hand::hatched_chick: Two in a row with no spaces',
        '',
        '## :ok_hand: :hatched_chick: Two in a row',
        '',
      ].join('\n'),
    );
    const expected = u('root', [
      heading('I ♥ unicode', 'i--unicode'),
      heading('Dash-dash', 'dash-dash'),
      // cSpell:ignore endash
      heading('en–dash', 'endash'),
      // cSpell:ignore emdash
      heading('em–dash', 'emdash'),
      heading('😄 unicode emoji', '-unicode-emoji'),
      heading('😄-😄 unicode emoji', '--unicode-emoji'),
      heading('😄_😄 unicode emoji', '_-unicode-emoji'),
      heading(null, ''),
      heading(null, '-1'),
      heading('Initial spaces', 'initial-spaces'),
      heading('Final spaces', 'final-spaces'),
      heading('Duplicate', 'duplicate'),
      heading('Duplicate', 'duplicate-1'),
      heading(':ok: No underscore', 'ok-no-underscore'),
      heading(':ok_hand: Single', 'ok_hand-single'),
      heading(
        ':ok_hand::hatched_chick: Two in a row with no spaces',
        // cSpell:ignore handhatched
        'ok_handhatched_chick-two-in-a-row-with-no-spaces',
      ),
      heading(
        ':ok_hand: :hatched_chick: Two in a row',
        'ok_hand-hatched_chick-two-in-a-row',
      ),
    ]);

    expect(result).toEqual(expected);
  });

  it('generates id from only text contents of headings if they contains HTML tags', async () => {
    const result = await process(
      '# <span class="normal-header">Normal</span>\n',
    );

    const expected = u('root', [
      u(
        'heading',
        {
          depth: 1,
          data: {hProperties: {id: 'normal'}, id: 'normal'},
        },
        [
          u('mdxJsxTextElement', {
            name: 'span',
            attributes: [
              u('mdxJsxAttribute', {
                name: 'class',
                value: 'normal-header',
              }),
            ],
            children: [u('text', 'Normal')],
          }),
        ],
      ),
    ]);

    expect(result).toEqual(expected);
  });

  describe('creates custom headings ids', () => {
    async function headingIdFor(input: string, format: 'md' | 'mdx' = 'mdx') {
      const result = await process(
        input,
        [],
        {anchorsMaintainCase: false},
        format,
      );
      const headers: {text: string; id: string}[] = [];
      visit(result, 'heading', (node) => {
        headers.push({
          text: toString(node),
          id: (node.data! as {id: string}).id,
        });
      });
      expect(headers).toHaveLength(1);
      return headers[0]!.id;
    }

    describe('historical syntax', () => {
      // Shared test because it's the same syntax for both md and mdx
      async function testHeadingIds(format: 'md' | 'mdx') {
        await expect(
          headingIdFor('# Heading One {#custom_h1}', format),
        ).resolves.toEqual('custom_h1');
        await expect(
          headingIdFor('## Heading Two {#custom-heading-two}', format),
        ).resolves.toEqual('custom-heading-two');

        await expect(
          headingIdFor('# With *Bold* {#custom-with-bold}', format),
        ).resolves.toEqual('custom-with-bold');

        await expect(
          headingIdFor('# With *Bold* hello{#custom-with-bold-hello}', format),
        ).resolves.toEqual('custom-with-bold-hello');

        await expect(
          headingIdFor(
            '# With *Bold* hello2 {#custom-with-bold-hello2}',
            format,
          ),
        ).resolves.toEqual('custom-with-bold-hello2');

        await expect(
          headingIdFor('# Snake-cased ID {#this_is_custom_id}', format),
        ).resolves.toEqual('this_is_custom_id');

        await expect(headingIdFor('# No custom ID', format)).resolves.toEqual(
          'no-custom-id',
        );

        await expect(headingIdFor('# {#id-only}', format)).resolves.toEqual(
          'id-only',
        );

        // in this case, we don't parse the heading id: the id is the text slug
        await expect(
          headingIdFor('# {#text-after} custom ID', format),
        ).resolves.toEqual('text-after-custom-id');
      }
      it('works for format CommonMark', async () => {
        await testHeadingIds('md');
      });

      it('works for format MDX', async () => {
        await testHeadingIds('mdx');
      });
    });
  });

  it('preserve anchors case then "anchorsMaintainCase" option is set', async () => {
    const result = await process('# Case Sensitive Heading', [], {
      anchorsMaintainCase: true,
    });
    const expected = u('root', [
      u(
        'heading',
        {
          depth: 1,
          data: {
            hProperties: {id: 'Case-Sensitive-Heading'},
            id: 'Case-Sensitive-Heading',
          },
        },
        [u('text', 'Case Sensitive Heading')],
      ),
    ]);

    expect(result).toEqual(expected);
  });
});
