/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/lib/server';

import pluginContentPages from '../index';
import {PluginOptionSchema} from '../pluginOptionSchema';

describe('docusaurus-plugin-content-pages', () => {
  it('loads simple pages', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext(siteDir);
    const plugin = await pluginContentPages(
      context,
      PluginOptionSchema.validate({
        path: 'src/pages',
      }).value,
    );
    const pagesMetadata = await plugin.loadContent!();

    expect(pagesMetadata).toMatchSnapshot();
  });

  it('loads simple pages with french translations', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext(siteDir);
    const plugin = await pluginContentPages(
      {
        ...context,
        i18n: {
          ...context.i18n,
          currentLocale: 'fr',
        },
      },
      PluginOptionSchema.validate({
        path: 'src/pages',
      }).value,
    );
    const pagesMetadata = await plugin.loadContent!();

    expect(pagesMetadata).toMatchSnapshot();
  });
});
