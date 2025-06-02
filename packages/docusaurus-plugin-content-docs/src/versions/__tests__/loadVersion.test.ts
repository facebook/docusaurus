/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {DEFAULT_PARSE_FRONT_MATTER} from '@docusaurus/utils/src';
import {readVersionsMetadata} from '../version';
import {DEFAULT_OPTIONS} from '../../options';
import {loadVersion} from '../loadVersion';
import type {I18n, LoadContext} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';

const DefaultI18N: I18n = {
  path: 'i18n',
  currentLocale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  localeConfigs: {},
};

describe('minimal site', () => {
  async function loadSite() {
    const siteDir = path.resolve(
      path.join(__dirname, './__fixtures__', 'minimal-site'),
    );
    const options: PluginOptions = fromPartial<PluginOptions>({
      ...DEFAULT_OPTIONS,
    });
    const context = fromPartial<LoadContext>({
      siteDir,
      baseUrl: '/',
      i18n: DefaultI18N,
      localizationDir: path.join(siteDir, 'i18n/en'),
      siteConfig: {
        markdown: {
          parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
        },
      },
    });
    return {
      siteDir,
      options,
      context,
    };
  }

  it('can load current version', async () => {
    const {options, context} = await loadSite();

    const versionsMetadata = await readVersionsMetadata({
      options,
      context,
    });

    expect(versionsMetadata).toHaveLength(1);
    expect(versionsMetadata[0]!.versionName).toBe('current');

    const versionMetadata = versionsMetadata[0]!;

    const loadedVersion = loadVersion({
      context,
      options,
      versionMetadata,
      env: 'production',
    });

    await expect(loadedVersion).resolves.toMatchSnapshot();
  });
});
