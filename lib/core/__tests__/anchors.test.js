/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const rules = require('remarkable/lib/rules');
const anchors = require('../anchors');

const md = {
  renderer: {
    rules: {
      heading_open: rules.heading_open,
    },
  },
};

anchors(md);

const render = md.renderer.rules.heading_open;

test('Anchors rendering', () => {
  expect(
    render([{hLevel: 1}, {content: 'Hello world'}], 0, {}, {}),
  ).toMatchSnapshot();
  expect(
    render([{hLevel: 2}, {content: 'Hello small world'}], 0, {}, {}),
  ).toMatchSnapshot();
});

test('Each anchor is unique across rendered document', () => {
  const tokens = [
    {hLevel: 1},
    {content: 'Almost unique heading'},
    {hLevel: 1},
    {content: 'Almost unique heading'},
    {hLevel: 1},
    {content: 'Almost unique heading 1'},
    {hLevel: 1},
    {content: 'Almost unique heading 1'},
    {hLevel: 1},
    {content: 'Almost unique heading 2'},
    {hLevel: 1},
    {content: 'Almost unique heading'},
  ];
  const options = {};
  const env = {};

  expect(render(tokens, 0, options, env)).toContain(
    'id="almost-unique-heading"',
  );
  expect(render(tokens, 2, options, env)).toContain(
    'id="almost-unique-heading-1"',
  );
  expect(render(tokens, 4, options, env)).toContain(
    'id="almost-unique-heading-1-1"',
  );
  expect(render(tokens, 6, options, env)).toContain(
    'id="almost-unique-heading-1-2"',
  );
  expect(render(tokens, 8, options, env)).toContain(
    'id="almost-unique-heading-2"',
  );
  expect(render(tokens, 10, options, env)).toContain(
    'id="almost-unique-heading-3"',
  );
});

test('Each anchor is unique across rendered document. Case 2', () => {
  const tokens = [
    {hLevel: 1},
    {content: 'foo'},
    {hLevel: 1},
    {content: 'foo 1'},
    {hLevel: 1},
    {content: 'foo'},
    {hLevel: 1},
    {content: 'foo 1'},
  ];
  const options = {};
  const env = {};

  expect(render(tokens, 0, options, env)).toContain('id="foo"');
  expect(render(tokens, 2, options, env)).toContain('id="foo-1"');
  expect(render(tokens, 4, options, env)).toContain('id="foo-2"');
  expect(render(tokens, 6, options, env)).toContain('id="foo-1-1"');
});

test('Anchor index resets on each render', () => {
  const tokens = [
    {hLevel: 1},
    {content: 'Almost unique heading'},
    {hLevel: 1},
    {content: 'Almost unique heading'},
  ];
  const options = {};
  const env = {};
  const env2 = {};

  expect(render(tokens, 0, options, env)).toContain(
    'id="almost-unique-heading"',
  );
  expect(render(tokens, 2, options, env)).toContain(
    'id="almost-unique-heading-1"',
  );

  expect(render(tokens, 0, options, env2)).toContain(
    'id="almost-unique-heading"',
  );
  expect(render(tokens, 2, options, env2)).toContain(
    'id="almost-unique-heading-1"',
  );
});

test('Anchor uses default renderer when empty', () => {
  expect(render([{hLevel: 1}, {content: null}], 0, {}, {})).toEqual('<h1>');
  expect(render([{hLevel: 2}, {content: ''}], 0, {}, {})).toEqual('<h2>');
});
