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

async function siteFixture(fixture: string) {
  const siteDir = path.resolve(path.join(__dirname, './__fixtures__', fixture));
  const options: PluginOptions = fromPartial<PluginOptions>({
    id: 'default',
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

  const versions = await readVersionsMetadata({
    options,
    context,
  });

  return {
    siteDir,
    options,
    context,
    versions,
  };
}

describe('loadVersion', () => {
  describe('minimal site', () => {
    it('can load current version', async () => {
      const {options, context, versions} = await siteFixture('site-minimal');

      const version = versions[0];
      expect(version).toBeDefined();
      expect(version.versionName).toBe('current');

      const loadedVersion = loadVersion({
        context,
        options,
        versionMetadata: version,
        env: 'production',
      });

      await expect(loadedVersion).resolves.toMatchSnapshot();
    });
  });

  describe('site with broken versions', () => {
    async function loadTestVersion(versionName: string) {
      const {options, context, versions} = await siteFixture(
        'site-broken-versions',
      );
      const version = versions.find((v) => v.versionName === versionName);
      if (!version) {
        throw new Error(`Version '${versionName}' should exist`);
      }
      return loadVersion({
        context,
        options,
        versionMetadata: version,
        env: 'production',
      });
    }

    it('rejects version with doc id conflict', async () => {
      await expect(() =>
        loadTestVersion('with-id-conflicts'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Version 'with-id-conflicts' should exist"`,
      );
    });
  });
});
