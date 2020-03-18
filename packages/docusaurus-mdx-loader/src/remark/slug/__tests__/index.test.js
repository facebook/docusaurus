/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) */

/* eslint-disable no-param-reassign */

import remark from 'remark';
import u from 'unist-builder';
import removePosition from 'unist-util-remove-position';
import slug from '../index';

function process(doc, plugins = []) {
  const processor = remark().use({plugins: [...plugins, slug]});
  return removePosition(processor.runSync(processor.parse(doc)), true);
}

function heading(label, id) {
  return u(
    'heading',
    {depth: 2, data: {id, hProperties: {id}}},
    label ? [u('text', label)] : [],
  );
}

describe('slug plugin', () => {
  test('should patch `id`s and `data.hProperties.id', () => {
    const result = process('# Normal\n\n## Table of Contents\n\n# Baz\n');
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

  test('should not overwrite `data` on headings', () => {
    const result = process('# Normal\n', [
      function() {
        function transform(tree) {
          tree.children[0].data = {foo: 'bar'};
        }
        return transform;
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

  test('should not overwrite `data.hProperties` on headings', () => {
    const result = process('# Normal\n', [
      function() {
        function transform(tree) {
          tree.children[0].data = {hProperties: {className: ['foo']}};
        }
        return transform;
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

  test('should generate `id`s and `hProperties.id`s, based on `hProperties.id` if they exist', () => {
    const result = process(
      [
        '## Something',
        '## Something here',
        '## Something there',
        '## Something also',
      ].join('\n\n'),
      [
        function() {
          function transform(tree) {
            tree.children[1].data = {hProperties: {id: 'here'}};
            tree.children[3].data = {hProperties: {id: 'something'}};
          }
          return transform;
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

  test('should create GitHub slugs', () => {
    const result = process(
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
      heading('en–dash', 'endash'),
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
        'ok_handhatched_chick-two-in-a-row-with-no-spaces',
      ),
      heading(
        ':ok_hand: :hatched_chick: Two in a row',
        'ok_hand-hatched_chick-two-in-a-row',
      ),
    ]);

    expect(result).toEqual(expected);
  });

  test('should generate slug from only text contents of headings if they contains HTML tags', () => {
    const result = process('# <span class="normal-header">Normal</span>\n');
    const expected = u('root', [
      u(
        'heading',
        {
          depth: 1,
          data: {hProperties: {id: 'normal'}, id: 'normal'},
        },
        [
          u('html', '<span class="normal-header">'),
          u('text', 'Normal'),
          u('html', '</span>'),
        ],
      ),
    ]);

    expect(result).toEqual(expected);
  });
});
