/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import prompts from 'prompts';
import logger from '@docusaurus/logger';

export type LanguagesOptions = {
  javascript?: boolean;
  typescript?: boolean;
};

export async function getLanguage(
  languages: LanguagesOptions,
  noTsVersionAvailable?: boolean,
): Promise<LanguagesOptions> {
  if (languages.typescript || languages.javascript) {
    return languages;
  }
  if (noTsVersionAvailable) {
    return {javascript: true};
  }
  const {language: selectedLanguage} = (await prompts(
    {
      type: 'select',
      name: 'language',
      message: 'Which language do you want to use?',
      choices: [
        {title: 'JavaScript', value: 'javascript'},
        {title: 'TypeScript', value: 'typescript'},
      ],
    },
    {
      onCancel() {
        logger.info`Falling back to language=${'javascript'}`;
      },
    },
  )) as {language: keyof LanguagesOptions};

  return {[selectedLanguage]: true};
}
