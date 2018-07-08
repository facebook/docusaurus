/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const readFileSync = require('fs').readFileSync;
const getTOC = require('../getTOC');

const mdContents = readFileSync(
  path.join(__dirname, '__fixtures__', 'getTOC.md'),
  'utf8'
);

test('with defaults', () => {
  const headings = getTOC(mdContents);
  const headingsJson = JSON.stringify(headings);

  expect(headings).toMatchSnapshot();
  expect(headingsJson).toContain('bar-8'); // maximum unique bar index is 8
  expect(headingsJson).not.toContain('4th level headings');
});

test('with custom heading levels', () => {
  const headings = getTOC(mdContents, 'h2', ['h3', 'h4']);
  const headingsJson = JSON.stringify(headings);

  expect(headings).toMatchSnapshot();
  expect(headingsJson).toContain('bar-8'); // maximum unique bar index is 8
  expect(headingsJson).toContain('4th level headings');
});
