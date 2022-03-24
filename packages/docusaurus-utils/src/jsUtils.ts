/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReportingSeverity} from '@docusaurus/types';
import logger from '@docusaurus/logger';

/** Removes a given string suffix from `str`. */
export function removeSuffix(str: string, suffix: string): string {
  if (suffix === '') {
    // str.slice(0, 0) is ""
    return str;
  }
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
}

/** Removes a given string prefix from `str`. */
export function removePrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

/**
 * `Array#map` for async operations where order matters.
 * @param array The array to traverse.
 * @param action An async action to be performed on every array item. Will be
 * awaited before working on the next.
 * @returns The list of results returned from every `action(item)`
 */
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

/**
 * `Array#find` for async operations where order matters.
 * @param array The array to traverse.
 * @param predicate An async predicate to be called on every array item. Should
 * return a boolean indicating whether the currently element should be returned.
 * @returns The function immediately returns the first item on which `predicate`
 * returns `true`, or `undefined` if none matches the predicate.
 */
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

/**
 * Takes a message and reports it according to the severity that the user wants.
 *
 * - `ignore`: completely no-op
 * - `log`: uses the `INFO` log level
 * - `warn`: uses the `WARN` log level
 * - `error`: uses the `ERROR` log level
 * - `throw`: aborts the process, throws the error.
 *
 * Since the logger doesn't have logging level filters yet, these severities
 * mostly just differ by their colors.
 *
 * @throws In addition to throwing when `reportingSeverity === "throw"`, this
 * function also throws if `reportingSeverity` is not one of the above.
 */
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
