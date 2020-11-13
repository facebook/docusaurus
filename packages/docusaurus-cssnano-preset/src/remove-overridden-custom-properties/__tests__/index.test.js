/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const vfile = require('to-vfile');
const postcss = require('postcss');
const postCssRemoveOverriddenCustomProperties = require('../index');

const processFixture = (name) => {
  const input = vfile.readSync(
    path.join(__dirname, 'fixtures', `${name}.css`),
    'utf8',
  );
  const output = postcss([postCssRemoveOverriddenCustomProperties]).process(
    input,
  );

  return output.css;
};

describe('remove-overridden-custom-properties', () => {
  test('overridden custom properties should be removed', () => {
    expect(processFixture('normal')).toMatchSnapshot();
  });

  test('overridden custom properties with `!important` rule should not be removed', () => {
    expect(processFixture('important_rule')).toMatchSnapshot();
  });
});
