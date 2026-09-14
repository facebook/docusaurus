/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import cliDocs from '../cli';
import {getVersionDocsDirPath, getVersionSidebarsPath} from '../versions/files';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
import type {LoadContext} from '@docusaurus/types';

const {cliDocsVersionCommand} = cliDocs;
const fixtureDir = path.join(__dirname, '__fixtures__');
const simpleSiteDir = path.join(fixtureDir, 'simple-site');

describe('versionedDocsPath', () => {
  it('writes versioned docs and sidebars under the configured path', async () => {
    let versionedDocsDir!: string;
    let versionedSidebarPath!: string;

    using copyMock = vi.spyOn(fs, 'copy').mockImplementation((_, dest) => {
      versionedDocsDir = dest as string;
    });
    using writeMock = vi.spyOn(fs, 'outputFile');
    writeMock.mockImplementationOnce((filepath) => {
      versionedSidebarPath = filepath;
    });
    writeMock.mockImplementationOnce(() => {});

    const versionedDocsPath = '../external-versions';
    const options = {
      id: DEFAULT_PLUGIN_ID,
      path: 'docs',
      sidebarPath: path.join(simpleSiteDir, 'sidebars.json'),
      versionedDocsPath,
    } as PluginOptions;

    await cliDocsVersionCommand('1.0.0', options, {
      siteDir: simpleSiteDir,
      i18n: {
        locales: ['en'],
        defaultLocale: 'en',
        currentLocale: 'en',
        path: 'i18n',
        localeConfigs: {
          en: {path: 'en', translate: true},
        },
      },
    } as unknown as LoadContext);

    expect(copyMock).toHaveBeenCalledWith(
      path.join(simpleSiteDir, options.path),
      expect.stringContaining('external-versions'),
    );
    expect(versionedDocsDir).toEqual(
      getVersionDocsDirPath(
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        '1.0.0',
        versionedDocsPath,
      ),
    );
    expect(versionedSidebarPath).toEqual(
      getVersionSidebarsPath(
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        '1.0.0',
        versionedDocsPath,
      ),
    );
  });
});
