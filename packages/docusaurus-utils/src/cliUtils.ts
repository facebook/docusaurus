/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import prompts, {type Choice} from 'prompts';
import logger from '@docusaurus/logger';

type PreferredLanguage = 'javascript' | 'typescript';

type AskPreferredLanguageOptions = {
  fallback: PreferredLanguage | undefined;
  exit: boolean;
};

const DefaultOptions: AskPreferredLanguageOptions = {
  fallback: undefined,
  exit: false,
};

const ExitChoice: Choice = {title: logger.yellow('[Exit]'), value: '[Exit]'};

export async function askPreferredLanguage(
  options: Partial<AskPreferredLanguageOptions> = {},
): Promise<'javascript' | 'typescript'> {
  const {fallback, exit} = {...DefaultOptions, ...options};

  const choices: Choice[] = [
    {title: logger.bold('JavaScript'), value: 'javascript'},
    {title: logger.bold('TypeScript'), value: 'typescript'},
  ];
  if (exit) {
    choices.push(ExitChoice);
  }

  const {language} = await prompts(
    {
      type: 'select',
      name: 'language',
      message: 'Which language do you want to use?',
      choices,
    },
    {
      onCancel() {
        exit && process.exit(0);
      },
    },
  );

  if (language === ExitChoice.value) {
    process.exit(0);
  }

  if (!language) {
    if (fallback) {
      logger.info`Falling back to language=${fallback}`;
      return fallback;
    }
    process.exit(0);
  }

  return language;
}
