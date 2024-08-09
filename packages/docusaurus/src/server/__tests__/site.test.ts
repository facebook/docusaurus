/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {mergeWithCustomize} from 'webpack-merge';
import {loadSetup} from './testUtils';
import type {Props} from '@docusaurus/types';
import type {DeepPartial} from 'utility-types';

describe('load', () => {
  it('loads props for site with custom i18n path', async () => {
    const site = await loadSetup('custom-i18n-site');
    expect(site.props).toMatchSnapshot();
    const site2 = await loadSetup('custom-i18n-site', {locale: 'zh-Hans'});
    expect(site2.props).toEqual(
      mergeWithCustomize<DeepPartial<Props>>({
        customizeArray(a, b, key) {
          return ['routesPaths', 'plugins'].includes(key) ? b : undefined;
        },
      })(site.props, {
        baseUrl: '/zh-Hans/',
        i18n: {
          currentLocale: 'zh-Hans',
        },
        localizationDir: path.join(
          __dirname,
          '__fixtures__/custom-i18n-site/i18n/zh-Hans-custom',
        ),
        outDir: path.join(
          __dirname,
          '__fixtures__/custom-i18n-site/build/zh-Hans',
        ),
        routesPaths: ['/zh-Hans/404.html'],
        siteConfig: {
          baseUrl: '/zh-Hans/',
        },
        siteStorage: {
          namespace: '',
          type: 'localStorage',
        },
        plugins: site2.props.plugins,
      }),
    );
  });
});
