/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {extractThemeCodeMessages} from '../update';
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';

// Seems the 5s default timeout fails sometimes
jest.setTimeout(15000);

describe('theme-translations package', () => {
  test(`to have base messages files contain EXACTLY all the translations extracted from the theme. Please run "yarn workspace @docusaurus/theme-translations update" to keep base messages files up-to-date.`, async () => {
    const baseMessagesDirPath = path.join(__dirname, '../locales/base');
    const baseMessages = Object.fromEntries(
      (
        await Promise.all(
          (
            await fs.readdir(baseMessagesDirPath)
          ).map(async (baseMessagesFile) =>
            Object.entries(
              JSON.parse(
                (
                  await fs.readFile(
                    path.join(baseMessagesDirPath, baseMessagesFile),
                  )
                ).toString(),
              ) as Record<string, string>,
            ),
          ),
        )
      )
        .flat()
        .filter(([key]) => !key.endsWith('___DESCRIPTION')),
    );
    const codeMessages = _.mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );

    expect(codeMessages).toEqual(baseMessages);
  });
});
