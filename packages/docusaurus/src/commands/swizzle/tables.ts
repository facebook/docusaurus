/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import Table from 'cli-table3';
import type {ThemeComponents} from './components';

const safeLabel = logger.green('safe');
const unsafeLabel = logger.red('unsafe');

export function statusTable(): string {
  const table = new Table({
    head: ['Status', 'CLI option', 'Description'],
  });

  table.push({
    [safeLabel]: [
      '',
      `
This component is safe to swizzle and was particularly designed for this purpose.
The swizzled component should be retro-compatible on Docusaurus minor version upgrades.
`,
    ],
  });

  table.push({
    [unsafeLabel]: [
      logger.code('--danger'),
      `
This component is unsafe to swizzle, but you can still do it!
Be aware that we might have to perform breaking changes on Docusaurus minor version upgrades
You will have to upgrade your component manually and maintain it over time.

${logger.green(
  'Tip',
)}: your customization can't be done in a ${safeLabel} way? Report it here: https://github.com/facebook/docusaurus/discussions/5468
`,
    ],
  });

  return table.toString();
}

export function actionsTable(): string {
  const table = new Table({
    head: ['Actions', 'CLI option', 'Description'],
  });

  table.push({
    [logger.bold('Wrap')]: [
      logger.code('--wrap'),
      `
Creates a wrapper around the original theme component.
Enables you to easily render other components before/after (or under/below) the original theme component.

${logger.green('Tip')}: prefer ${logger.code(
        '--wrap',
      )} whenever possible: it reduces the amount of code you have to maintain.
      `,
    ],
  });

  table.push({
    [logger.bold('Copy')]: [
      logger.code('--copy'),
      `
Creates a copy of the original theme component.
Enables you to override the original component entirely with your own UI and logic.

${logger.green('Tip')}: ${logger.code(
        '--copy',
      )} can be useful to entirely change the design of a component.
`,
    ],
  });

  return table.toString();
}

export function themeComponentsTable(themeComponents: ThemeComponents): string {
  const table = new Table({
    head: ['Component name', 'Copy', 'Wrap', 'Description'],
  });

  themeComponents.all.forEach((component) => {
    table.push({
      [component]: [
        themeComponents.isSafe(component) ? safeLabel : unsafeLabel,
        themeComponents.isSafe(component) ? safeLabel : unsafeLabel, // TODO
        'Lorem Ipsum', // TODO
      ],
    });
  });

  return table.toString();
}
