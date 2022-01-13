/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import type {InitializedPlugin} from '@docusaurus/types';
import leven from 'leven';
import {orderBy, uniq} from 'lodash';
import {askThemeName} from './prompts';
import {findStringIgnoringCase} from './utils';

export function getThemeNames(plugins: InitializedPlugin[]): string[] {
  const themeNames = uniq(
    // The fact that getThemePath is attached to the plugin instance makes
    // this code impossible to optimize. If this is a static method, we don't
    // need to initialize all plugins just to filter which are themes
    // Benchmark: loadContext-58ms; initPlugins-323ms
    plugins
      .filter(
        (plugin) => plugin.getThemePath && plugin.version.type === 'package',
      )
      .map((plugin) => (plugin.version as {name: string}).name),
  );

  // Opinionated ordering: user is most likely to swizzle:
  // - the classic theme
  // - official themes
  // - official plugins
  return orderBy(
    themeNames,
    [
      (t) => t === '@docusaurus/theme-classic',
      (t) => t.includes('@docusaurus/theme'),
      (t) => t.includes('@docusaurus'),
    ],
    ['desc', 'desc', 'desc'],
  );
}

// Returns a valid value if recovering is possible
function handleInvalidThemeNameParam({
  themeNameParam,
  themeNames,
}: {
  themeNameParam: string;
  themeNames: string[];
}): string {
  // Trying to recover invalid value
  // We look for potential matches that only differ in casing.
  const differentCaseMatch = findStringIgnoringCase(themeNameParam, themeNames);
  if (differentCaseMatch) {
    logger.warn`Theme name=${themeNameParam} doesn't exist.`;
    logger.info`name=${differentCaseMatch} will be used instead of name=${themeNameParam}.`;
    return differentCaseMatch;
  }

  // TODO recover from short theme-names here: "classic" => "@docusaurus/theme-classic"

  // No recovery value is possible: print error
  const suggestion = themeNames.find(
    (name) => leven(name, themeNameParam!) < 4,
  );
  logger.error`Theme name=${themeNameParam} not found. ${
    suggestion
      ? logger.interpolate`Did you mean name=${suggestion}?`
      : logger.interpolate`Themes available for swizzle: ${themeNames}`
  }`;
  return process.exit(1);
}

async function handleThemeNameParam({
  themeNameParam,
  themeNames,
}: {
  themeNameParam: string;
  themeNames: string[];
}): Promise<string> {
  const isValidName = themeNames.includes(themeNameParam);
  if (!isValidName) {
    return handleInvalidThemeNameParam({
      themeNameParam,
      themeNames,
    });
  }
  return themeNameParam;
}

export async function getThemeName({
  themeNameParam,
  themeNames,
  list,
}: {
  themeNameParam: string | undefined;
  themeNames: string[];
  list: boolean | undefined;
}): Promise<string> {
  if (list) {
    logger.info`Themes available for swizzle: name=${themeNames}`;
    return process.exit(0);
  }
  return themeNameParam
    ? handleThemeNameParam({themeNameParam, themeNames})
    : askThemeName(themeNames);
}

export function getThemePath({
  plugins,
  themeName,
  typescript,
}: {
  plugins: InitializedPlugin[];
  themeName: string;
  typescript: boolean | undefined;
}): string {
  // Attaching getThemePath to the plugin instance means it is possible for a
  // plugin to return different paths given different options. Maybe we need to
  // pass in a plugin ID to decide which plugin to load?
  const pluginInstance = plugins.find(
    (plugin) =>
      plugin.version.type === 'package' && plugin.version.name === themeName,
  )!;
  const themePath = typescript
    ? pluginInstance.getTypeScriptThemePath?.()
    : pluginInstance.getThemePath?.();
  if (!themePath) {
    logger.warn(
      typescript
        ? logger.interpolate`name=${themeName} does not provide TypeScript theme code via ${'getTypeScriptThemePath()'}.`
        : // This is... technically possible to happen, e.g. returning undefined
          // from getThemePath. Plugins may intentionally or unintentionally
          // disguise as themes?
          logger.interpolate`name=${themeName} does not provide any theme code.`,
    );
    return process.exit(1);
  }
  return themePath;
}
