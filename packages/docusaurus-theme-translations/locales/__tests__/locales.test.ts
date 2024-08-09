/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import {extractThemeCodeMessages} from '../../src/utils';

describe('theme translations', () => {
  it('has base messages files contain EXACTLY all the translations extracted from the theme. Please run "yarn workspace @docusaurus/theme-translations update" to keep base messages files up-to-date', async () => {
    const baseMessagesDirPath = path.join(__dirname, '../base');
    const baseMessages = await fs
      .readdir(baseMessagesDirPath)
      .then((files) =>
        Promise.all(
          files.map(
            (baseMessagesFile) =>
              fs.readJSON(
                path.join(baseMessagesDirPath, baseMessagesFile),
              ) as Promise<{[key: string]: string}>,
          ),
        ),
      )
      .then((translations) =>
        Object.fromEntries(
          translations
            .map(Object.entries)
            .flat()
            .filter(([key]) => !key.endsWith('___DESCRIPTION')),
        ),
      );
    const codeMessages = _.mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );

    expect(codeMessages).toEqual(baseMessages);
  });
});
