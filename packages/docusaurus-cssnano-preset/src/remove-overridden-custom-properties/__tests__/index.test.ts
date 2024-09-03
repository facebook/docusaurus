/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import vfile from 'to-vfile';
import postcss from 'postcss';
import postCssRemoveOverriddenCustomProperties from '../index';

const processFixture = async (name: string) => {
  const input = await vfile.read(
    path.join(__dirname, '__fixtures__', `${name}.css`),
    'utf8',
  );
  const output = postcss([postCssRemoveOverriddenCustomProperties]).process(
    input,
  );

  return output.css;
};

describe('remove-overridden-custom-properties', () => {
  it('overridden custom properties should be removed', async () => {
    await expect(processFixture('normal')).resolves.toMatchSnapshot();
  });

  it('overridden custom properties with `!important` rule should not be removed', async () => {
    await expect(processFixture('important_rule')).resolves.toMatchSnapshot();
  });
});
