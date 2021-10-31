/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {extractThemeCodeMessages} from './update-code-translations';
import fs from 'fs-extra';
import {mapValues, pickBy} from 'lodash';

// Seems the 5s default timeout fails sometimes
jest.setTimeout(15000);

describe('update-code-translations', () => {
  test(`to have base.json contain EXACTLY all the translations extracted from the theme. Please run "yarn workspace @docusaurus/theme-classic update-code-translations" to keep base.json up-to-date.`, async () => {
    const baseMessages = pickBy(
      JSON.parse(
        await fs.readFile(
          new URL('./codeTranslations/base.json', import.meta.url).pathname,
        ),
      ),
      (_, key) => !key.endsWith('___DESCRIPTION'),
    );

    const codeMessages = mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );
    expect(codeMessages).toEqual(baseMessages);
  });
});
