/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {extractThemeCodeMessages} from '../../src/utils';
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';

// Seems the 5s default timeout fails sometimes
jest.setTimeout(15000);

describe('theme translations', () => {
  it('has base messages files contain EXACTLY all the translations extracted from the theme. Please run "yarn workspace @docusaurus/theme-translations update" to keep base messages files up-to-date', async () => {
    const baseMessagesDirPath = path.join(__dirname, '../base');
    const baseMessages = Object.fromEntries(
      await Promise.all(
        (
          await fs.readdir(baseMessagesDirPath)
        ).map(async (baseMessagesFile) =>
          Object.entries(
            (await fs.readJSON(
              path.join(baseMessagesDirPath, baseMessagesFile),
              'utf-8',
            )) as {[key: string]: string},
          ),
        ),
      ).then((translations) =>
        translations.flat().filter(([key]) => !key.endsWith('___DESCRIPTION')),
      ),
    );
    const codeMessages = _.mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );

    expect(codeMessages).toEqual(baseMessages);
  });
});
