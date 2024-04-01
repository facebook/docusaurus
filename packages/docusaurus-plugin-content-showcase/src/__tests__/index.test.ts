/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/src/server/site';
import {normalizePluginOptions} from '@docusaurus/utils-validation';

import pluginContentPages from '../index';
import {validateOptions} from '../options';

// todo add test with tags in config
// todo add test with tags in yaml

describe('docusaurus-plugin-content-showcase', () => {
  it('loads simple showcase', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext({siteDir});
    const plugin = pluginContentPages(
      context,
      validateOptions({
        validate: normalizePluginOptions,
        options: {
          // todo broken because we use aliasedPaths
          path: 'src/showcase',
        },
      }),
    );
    const showcaseMetadata = await plugin.loadContent!();

    expect(showcaseMetadata).toMatchSnapshot();
  });
});
