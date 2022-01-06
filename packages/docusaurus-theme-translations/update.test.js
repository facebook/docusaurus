/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {extractThemeCodeMessages} = require('./update');
const path = require('path');
const fs = require('fs-extra');
const {mapValues, pickBy} = require('lodash');

// Seems the 5s default timeout fails sometimes
jest.setTimeout(15000);

describe('theme-translations package', () => {
  test(`to have base messages files contain EXACTLY all the translations extracted from the theme. Please run "yarn workspace @docusaurus/theme-translations update" to keep base messages files up-to-date.`, async () => {
    const baseMessagesDirPath = path.join(__dirname, 'locales/base');
    const baseMessages = pickBy(
      await fs
        .readdirSync(baseMessagesDirPath)
        .reduce(async (messages, baseMessagesFile) => {
          const newMessages = {
            ...(await messages),
            ...JSON.parse(
              await fs.readFile(
                path.join(baseMessagesDirPath, baseMessagesFile),
              ),
            ),
          };
          return newMessages;
        }, {}),
      (_, key) => !key.endsWith('___DESCRIPTION'),
    );
    const codeMessages = mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );

    expect(codeMessages).toEqual(baseMessages);
  });
});
