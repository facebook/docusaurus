/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import input from '@inquirer/input';
import select from '@inquirer/select';
import {logger} from '@docusaurus/logger';

// The context is only passed by tests, to render the prompts in memory
type PromptContext = Parameters<typeof input>[1];

type PromptConfig = {
  message: string;
  // The CLI argument or option to use instead of answering the prompt
  answerHint: string;
};

type SelectConfig<Value> = PromptConfig & {
  choices: {name: string; value: Value}[];
};

type InputConfig = PromptConfig & {
  default?: string;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
};

export async function askSelect<Value>(
  {answerHint, ...config}: SelectConfig<Value>,
  context?: PromptContext,
): Promise<Value> {
  return exitWithoutAnswer(select(config, context), {
    message: config.message,
    answerHint,
  });
}

export async function askInput(
  {answerHint, ...config}: InputConfig,
  context?: PromptContext,
): Promise<string> {
  return exitWithoutAnswer(input(config, context), {
    message: config.message,
    answerHint,
  });
}

// Inquirer rejects on Ctrl+C, and on exit when stdin is closed (like in CI)
async function exitWithoutAnswer<Answer>(
  answer: Promise<Answer>,
  {message, answerHint}: PromptConfig,
): Promise<Answer> {
  try {
    return await answer;
  } catch (err) {
    if (err instanceof Error && err.name === 'ExitPromptError') {
      logger.error`No answer to the prompt: ${message}
Answer it with ${answerHint}.`;
      process.exit(1);
    }
    throw err;
  }
}

export async function askPreferredLanguage(): Promise<
  'javascript' | 'typescript'
> {
  return askSelect({
    message: 'Which language do you want to use?',
    choices: [
      {name: logger.bold('JavaScript'), value: 'javascript'},
      {name: logger.bold('TypeScript'), value: 'typescript'},
    ],
    answerHint: 'the --javascript or --typescript option',
  });
}

export async function askForCustomGitCloneCommand(): Promise<string> {
  return askInput({
    message:
      'Write your own git clone command. The repository URL and destination directory will be supplied. E.g. "git clone --depth 10"',
    default: 'git clone',
    answerHint: 'a --git-strategy option other than custom',
  });
}
