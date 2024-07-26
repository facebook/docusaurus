/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import leven from 'leven';
import type {NormalizedPluginConfig} from '../../server/plugins/configs';
import type {
  InitializedPlugin,
  SwizzleAction,
  SwizzleActionStatus,
} from '@docusaurus/types';

export const SwizzleActions: SwizzleAction[] = ['wrap', 'eject'];

export const SwizzleActionsStatuses: SwizzleActionStatus[] = [
  'safe',
  'unsafe',
  'forbidden',
];

export const PartiallySafeHint = logger.red('*');

export function actionStatusLabel(status: SwizzleActionStatus): string {
  return _.capitalize(status);
}

const SwizzleActionStatusColors: {
  [status in SwizzleActionStatus]: (str: string) => string;
} = {
  safe: logger.green,
  unsafe: logger.yellow,
  forbidden: logger.red,
};

export function actionStatusColor(
  status: SwizzleActionStatus,
  str: string,
): string {
  const colorFn = SwizzleActionStatusColors[status];
  return colorFn(str);
}

export function actionStatusSuffix(
  status: SwizzleActionStatus,
  options: {partiallySafe?: boolean} = {},
): string {
  return ` (${actionStatusColor(status, actionStatusLabel(status))}${
    options.partiallySafe ? PartiallySafeHint : ''
  })`;
}

export type SwizzlePlugin = {
  instance: InitializedPlugin;
  plugin: NormalizedPluginConfig;
};

export type SwizzleContext = {plugins: SwizzlePlugin[]};

export type SwizzleCLIOptions = {
  typescript: boolean;
  javascript: boolean;
  danger: boolean;
  list: boolean;
  wrap: boolean;
  eject: boolean;
  config?: string;
};

export function normalizeOptions(
  options: Partial<SwizzleCLIOptions>,
): SwizzleCLIOptions {
  return {
    typescript: options.typescript ?? false,
    javascript: options.javascript ?? false,
    danger: options.danger ?? false,
    list: options.list ?? false,
    wrap: options.wrap ?? false,
    eject: options.eject ?? false,
    config: options.config ?? undefined,
  };
}

export function findStringIgnoringCase(
  str: string,
  values: string[],
): string | undefined {
  return values.find((v) => v.toLowerCase() === str.toLowerCase());
}

export function findClosestValue(
  str: string,
  values: string[],
  maxLevenshtein = 3,
): string | undefined {
  return values.find((v) => leven(v, str) <= maxLevenshtein);
}
