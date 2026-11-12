/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {validateOptions} from '../options';
import type {Validate} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-pwa';

function testValidate(options: {injectManifestConfig: object}) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<PluginOptions, PluginOptions>,
    options: options as PluginOptions,
  });
}

describe('validateOptions', () => {
  it('accepts injectManifestConfig options', () => {
    const injectManifestConfig = {
      globPatterns: ['**/*.pdf'],
      modifyURLPrefix: {'assets/': 'static/'},
    };
    expect(testValidate({injectManifestConfig}).injectManifestConfig).toEqual(
      injectManifestConfig,
    );
  });

  it('rejects injectManifestConfig.globFollow', () => {
    expect(() =>
      testValidate({injectManifestConfig: {globFollow: false}}),
    ).toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: "injectManifestConfig.globFollow" is not allowed]`,
    );
  });

  it('rejects injectManifestConfig.templatedURLs', () => {
    expect(() =>
      testValidate({injectManifestConfig: {templatedURLs: {'/app': 'shell'}}}),
    ).toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: "injectManifestConfig.templatedURLs" is not allowed]`,
    );
  });
});
