/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import path from 'node:path';
import {fromPartial} from '@total-typescript/shoehorn';
import {collectAllSiteMessages} from '../siteMessages';

function siteDirFixture(name: string) {
  return path.resolve(__dirname, '__fixtures__', 'siteMessages', name);
}

describe('collectAllSiteMessages', () => {
  describe('uselessBabelConfigMessages', () => {
    async function getMessagesFor({
      siteDir,
      rspackBundler,
    }: {
      siteDir: string;
      rspackBundler: boolean;
    }) {
      return collectAllSiteMessages(
        fromPartial({
          site: {
            props: {
              siteDir,
              siteConfig: {
                future: {
                  faster: {
                    rspackBundler,
                  },
                },
              },
            },
          },
        }),
      );
    }

    it('warns for useless babel config file when Rspack enabled', async () => {
      const messages = await getMessagesFor({
        siteDir: siteDirFixture('siteWithBabelConfigFile'),
        rspackBundler: true,
      });
      expect(messages).toMatchInlineSnapshot(`
              [
                {
                  "message": "Your site is using the SWC js loader. You can safely remove the Babel config file at \`packages/docusaurus/src/server/__tests__/__fixtures__/siteMessages/siteWithBabelConfigFile/babel.config.js\`.",
                  "type": "warning",
                },
              ]
          `);
    });

    it('does not warn for babel config file when Rspack disabled', async () => {
      const messages = await getMessagesFor({
        siteDir: siteDirFixture('siteWithBabelConfigFile'),
        rspackBundler: false,
      });
      expect(messages).toMatchInlineSnapshot(`[]`);
    });
  });
});
