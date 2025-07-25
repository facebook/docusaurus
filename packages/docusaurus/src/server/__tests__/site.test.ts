/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadSetup} from './testUtils';

describe('load', () => {
  it('loads props for site', async () => {
    const site = await loadSetup('custom-i18n-site');
    expect(site.props).toMatchSnapshot();
  });

  it('loads props for site - custom i18n path', async () => {
    const site = await loadSetup('custom-i18n-site', {locale: 'zh-Hans'});
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
