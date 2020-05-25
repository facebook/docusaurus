/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {RedirectMetadata} from './types';

type RedirectFile = Pick<
  RedirectMetadata,
  'redirectAbsoluteFilePath' | 'redirectPageContent'
>;

export default async function writeRedirectFiles(redirects: RedirectFile[]) {
  async function writeRedirectFile(redirect: RedirectFile) {
    try {
      await fs.writeFile(
        redirect.redirectAbsoluteFilePath,
        redirect.redirectPageContent,
      );
    } catch (err) {
      throw new Error(`Redirect file creation error: ${err}`);
    }
  }
  await Promise.all(redirects.map(writeRedirectFile));
}
