/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import leven from 'leven';
import logger from '@docusaurus/logger';
import type {SwizzleAction, SwizzleActionStatus} from '@docusaurus/types';

export const SwizzleActions: SwizzleAction[] = ['wrap', 'eject'];

export function actionStatusSuffix(status: SwizzleActionStatus): string {
  return status === 'safe'
    ? ` (${logger.green('safe')})`
    : ` (${logger.red('unsafe')})`;
}

export type SwizzleOptions = {
  typescript: boolean;
  danger: boolean;
  list: boolean;
  wrap: boolean;
  eject: boolean;
};

export function normalizeOptions(
  options: Partial<SwizzleOptions>,
): SwizzleOptions {
  return {
    typescript: options.typescript ?? false,
    danger: options.danger ?? false,
    list: options.list ?? false,
    wrap: options.wrap ?? false,
    eject: options.eject ?? false,
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
