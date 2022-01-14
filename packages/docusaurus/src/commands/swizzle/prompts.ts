/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import prompts from 'prompts';
import type {ThemeComponents} from './components';

const ExitTitle = logger.yellow('[Exit]');

export async function askThemeName(themeNames: string[]): Promise<string> {
  const {themeName} = await prompts({
    type: 'select',
    name: 'themeName',
    message: 'Select a theme to swizzle:',
    choices: themeNames
      .map((theme) => ({title: theme, value: theme}))
      .concat({title: ExitTitle, value: '[Exit]'}),
  });
  if (!themeName || themeName === '[Exit]') {
    process.exit(0);
  }
  return themeName;
}

function dangerSuffix(isDangerous: boolean): string {
  return isDangerous ? ` ${logger.red('(internal)')}` : '';
}

export async function askComponentName(
  themeComponents: ThemeComponents,
): Promise<string> {
  function formatComponentName(componentName: string): string {
    const isDangerous = !themeComponents.isSafe(componentName);
    return `${componentName}${dangerSuffix(isDangerous)}`;
  }

  const {componentName} = await prompts({
    type: 'autocomplete',
    name: 'componentName',
    message: 'Select or type the component to swizzle:',
    // limit: 30, // This doesn't work in my terminal
    // limit: Number.POSITIVE_INFINITY, // This does not work well and messes up with terminal scroll position
    choices: themeComponents.all
      .map((compName) => ({
        title: formatComponentName(compName),
        value: compName,
      }))
      .concat({title: ExitTitle, value: '[Exit]'}),
    async suggest(input, choices) {
      return choices.filter((choice) =>
        choice.title.toLowerCase().includes(input.toLowerCase()),
      );
    },
  });

  if (!componentName || componentName === '[Exit]') {
    return process.exit(0);
  }

  return componentName;
}

export async function askSwizzleDangerousComponent(): Promise<boolean> {
  const {switchToDanger} = await prompts({
    type: 'select',
    name: 'switchToDanger',
    message: `Do you really want to swizzle this internal component?`,
    choices: [
      {title: logger.green('NO: cancel and stay safe'), value: false},
      {
        title: logger.red('YES: I know what I am doing!'),
        value: true,
      },
      {title: ExitTitle, value: '[Exit]'},
    ],
  });

  if (typeof switchToDanger === 'undefined' || switchToDanger === '[Exit]') {
    return process.exit(0);
  }

  return !!switchToDanger;
}
