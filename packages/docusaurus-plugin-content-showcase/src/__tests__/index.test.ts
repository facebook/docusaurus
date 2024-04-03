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

describe('docusaurus-plugin-content-showcase', () => {
  it('loads simple showcase', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext({siteDir});
    const plugin = pluginContentPages(
      context,
      validateOptions({
        validate: normalizePluginOptions,
        options: {
          path: 'src/showcase',
          tags: 'tags.yaml',
        },
      }),
    );
    const showcaseMetadata = await plugin.loadContent!();

    expect(showcaseMetadata).toMatchSnapshot();
  });

  it('loads simple showcase with tags in options', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext({siteDir});
    const plugin = pluginContentPages(
      context,
      validateOptions({
        validate: normalizePluginOptions,
        options: {
          path: 'src/showcase',
          tags: {
            opensource: {
              label: 'Open-Source',
              description: {
                message:
                  'Open-Source Docusaurus sites can be useful for inspiration!',
                id: 'showcase.tag.opensource.description',
              },
              color: '#39ca30',
            },
            meta: {
              label: 'Meta',
              description: {
                message:
                  'Docusaurus sites of Meta (formerly Facebook) projects',
                id: 'showcase.tag.meta.description',
              },
              color: '#4267b2',
            },
          },
        },
      }),
    );
    const showcaseMetadata = await plugin.loadContent!();

    expect(showcaseMetadata).toMatchSnapshot();
  });

  it('throw loading inexistant tags file', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext({siteDir});
    const plugin = pluginContentPages(
      context,
      validateOptions({
        validate: normalizePluginOptions,
        options: {
          path: 'src/showcase',
          tags: 'wrong.yaml',
        },
      }),
    );
    await expect(
      plugin.loadContent!(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to read tags file for showcase"`,
    );
  });
});
