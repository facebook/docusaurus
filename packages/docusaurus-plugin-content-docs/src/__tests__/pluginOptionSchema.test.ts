/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

describe('normalizePluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    let {value} = await PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', async () => {
    let value = await PluginOptionSchema.validate({routeBasePath: 'docs'});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should reject bad path inputs', async () => {
    let {error} = await PluginOptionSchema.validate({
      path: 2,
    });
    expect(error).toMatchSnapshot();
  });

  test('should reject bad homePageId inputs', async () => {
    let {error} = await PluginOptionSchema.validate({
      path: 2,
    });
    expect(error).toMatchSnapshot();
  });

  test('should reject bad include inputs', async () => {
    let {error} = await PluginOptionSchema.validate({include: '**/*.{md,mdx}'});
    expect(error).toMatchSnapshot();
  });

  test('should reject bad include inputs', async () => {
    let {error} = await PluginOptionSchema.validate({
      showLastUpdateTime: 'true',
    });
    expect(error).toMatchSnapshot();
  });
});
