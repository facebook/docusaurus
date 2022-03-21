/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReportingSeverity} from '@docusaurus/types';
import logger from '@docusaurus/logger';

export function removeSuffix(str: string, suffix: string): string {
  if (suffix === '') {
    return str; // always returns "" otherwise!
  }
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
}

export function removePrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

export function getElementsAround<T>(
  array: T[],
  aroundIndex: number,
): {
  next: T | undefined;
  previous: T | undefined;
} {
  const min = 0;
  const max = array.length - 1;
  if (aroundIndex < min || aroundIndex > max) {
    throw new Error(
      `Valid "aroundIndex" for array (of size ${array.length}) are between ${min} and ${max}, but you provided ${aroundIndex}.`,
    );
  }
  const previous = aroundIndex === min ? undefined : array[aroundIndex - 1];
  const next = aroundIndex === max ? undefined : array[aroundIndex + 1];
  return {previous, next};
}

export async function mapAsyncSequential<T, R>(
  array: T[],
  action: (t: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (const t of array) {
    const result = await action(t);
    results.push(result);
  }
  return results;
}

export async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }
  return undefined;
}

export function reportMessage(
  message: string,
  reportingSeverity: ReportingSeverity,
): void {
  switch (reportingSeverity) {
    case 'ignore':
      break;
    case 'log':
      logger.info(message);
      break;
    case 'warn':
      logger.warn(message);
      break;
    case 'error':
      logger.error(message);
      break;
    case 'throw':
      throw new Error(message);
    default:
      throw new Error(
        `Unexpected "reportingSeverity" value: ${reportingSeverity}.`,
      );
  }
}
