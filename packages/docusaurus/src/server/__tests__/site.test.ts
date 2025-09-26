/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadSiteFixture} from './testUtils';

describe('loadSite', () => {
  describe('simple-site-with-baseUrl', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl';

    it('loads site', async () => {
      const site = await loadSiteFixture(siteFixture);
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - custom outDir', async () => {
      const site = await loadSiteFixture(siteFixture, {
        outDir: 'custom-out-dir',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - custom config', async () => {
      const site = await loadSiteFixture(siteFixture, {
        config: 'docusaurus.config.custom.js',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - non-existing config', async () => {
      await expect(() =>
        loadSiteFixture(siteFixture, {
          config: 'docusaurus.config.doesNotExist.js',
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Config file at "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/__fixtures__/loadSiteFixtures/simple-site-with-baseUrl/docusaurus.config.doesNotExist.js" not found."`,
      );
    });
  });

  describe('simple-site-with-baseUrl-i18n', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl-i18n';

    it('loads site', async () => {
      const site = await loadSiteFixture(siteFixture);
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - custom outDir', async () => {
      const site = await loadSiteFixture(siteFixture, {
        outDir: 'custom-out-dir',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - locale en', async () => {
      const site = await loadSiteFixture(siteFixture, {
        locale: 'en',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - locale fr', async () => {
      const site = await loadSiteFixture(siteFixture, {
        locale: 'fr',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site -  locale fr + custom outDir', async () => {
      const site = await loadSiteFixture(siteFixture, {
        outDir: 'custom-out-dir',
        locale: 'fr',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - locale es', async () => {
      const site = await loadSiteFixture(siteFixture, {
        locale: 'es',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - locale de', async () => {
      const site = await loadSiteFixture(siteFixture, {
        locale: 'de',
      });
      expect(site.props).toMatchSnapshot();
    });

    it('loads site - locale it', async () => {
      const site = await loadSiteFixture(siteFixture, {
        locale: 'it',
      });
      expect(site.props).toMatchSnapshot();
    });
  });

  describe('custom-i18n-site', () => {
    it('loads site', async () => {
      const site = await loadSiteFixture('custom-i18n-site');

      expect(site.props).toMatchSnapshot();
    });

    it('loads site - zh-Hans locale', async () => {
      const site = await loadSiteFixture('custom-i18n-site', {
        locale: 'zh-Hans',
      });

      expect(site.props).toEqual(
        expect.objectContaining({
          baseUrl: '/zh-Hans/',
          i18n: expect.objectContaining({
            currentLocale: 'zh-Hans',
          }),
          localizationDir: path.join(
            __dirname,
            '__fixtures__/custom-i18n-site/i18n/zh-Hans-custom',
          ),
          outDir: path.join(
            __dirname,
            '__fixtures__/custom-i18n-site/build/zh-Hans/',
          ),
          routesPaths: ['/zh-Hans/404.html'],
          siteConfig: expect.objectContaining({
            baseUrl: '/zh-Hans/',
          }),
          siteStorage: {
            namespace: '',
            type: 'localStorage',
          },
          plugins: site.props.plugins,
        }),
      );
    });
  });
});
