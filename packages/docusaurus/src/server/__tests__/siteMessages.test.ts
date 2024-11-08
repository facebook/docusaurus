/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {collectAllSiteMessages} from '../siteMessages';

function siteDirFixture(name: string) {
  return path.resolve(__dirname, '__fixtures__', 'siteMessages', name);
}

describe('collectAllSiteMessages', () => {
  describe('uselessBabelConfigMessages', () => {
    async function getMessagesFor({
      siteDir,
      swcJsLoader,
    }: {
      siteDir: string;
      swcJsLoader: boolean;
    }) {
      return collectAllSiteMessages(
        fromPartial({
          site: {
            props: {
              siteDir,
              siteConfig: {
                future: {
                  experimental_faster: {
                    swcJsLoader,
                  },
                },
              },
            },
          },
        }),
      );
    }

    it('warns for useless babel config file when SWC enabled', async () => {
      const messages = await getMessagesFor({
        siteDir: siteDirFixture('siteWithBabelConfigFile'),
        swcJsLoader: true,
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

    it('does not warn for babel config file when SWC disabled', async () => {
      const messages = await getMessagesFor({
        siteDir: siteDirFixture('siteWithBabelConfigFile'),
        swcJsLoader: false,
      });
      expect(messages).toMatchInlineSnapshot(`[]`);
    });
  });
});
