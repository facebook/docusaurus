/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import {getPluginVersion, loadSiteMetadata} from '../siteMetadata';
import type {LoadedPlugin} from '@docusaurus/types';

describe('getPluginVersion', () => {
  it('detects external packages plugins versions', async () => {
    await expect(
      getPluginVersion(
        path.join(__dirname, '__fixtures__/siteMetadata/dummy-plugin.js'),
        // Make the plugin appear external.
        path.join(__dirname, '..', '..', '..', '..', '..', '..', 'website'),
      ),
    ).resolves.toEqual({type: 'package', version: 'random-version'});
  });

  it('detects project plugins versions', async () => {
    await expect(
      getPluginVersion(
        path.join(__dirname, '__fixtures__/siteMetadata/dummy-plugin.js'),
        // Make the plugin appear project local.
        path.join(__dirname, '__fixtures__/siteMetadata'),
      ),
    ).resolves.toEqual({type: 'project'});
  });

  it('detects local packages versions', async () => {
    await expect(getPluginVersion('/', '/')).resolves.toEqual({type: 'local'});
  });
});

describe('loadSiteMetadata', () => {
  it('throws if plugin versions mismatch', async () => {
    await expect(
      loadSiteMetadata({
        plugins: [
          {
            name: 'docusaurus-plugin-content-docs',
            version: {
              type: 'package',
              version: '1.0.0',
              name: '@docusaurus/plugin-content-docs',
            },
          },
        ] as LoadedPlugin[],
        siteDir: path.join(__dirname, '__fixtures__/siteMetadata'),
      }),
    ).rejects
      .toThrow(`Invalid name=docusaurus-plugin-content-docs version number=1.0.0.
All official @docusaurus/* packages should have the exact same version as @docusaurus/core (number=${DOCUSAURUS_VERSION}).
Maybe you want to check, or regenerate your yarn.lock or package-lock.json file?`);
  });
});
