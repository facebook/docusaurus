/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Forked from https://github.com/tribou/jest-serializer-path/blob/master/lib/index.js
// Added some project-specific handlers

import os from 'os';
import path from 'path';
import _ from 'lodash';
import {escapePath} from '@docusaurus/utils';
import {version} from '@docusaurus/core/package.json';
import stripAnsi from 'strip-ansi';

export function print(
  val: unknown,
  serialize: (val: unknown) => string,
): string {
  if (val instanceof Error) {
    const message = normalizePaths(val.message);
    const error = new Error(message);
    const allKeys = [
      ...Object.getOwnPropertyNames(error),
      ...Object.keys(val),
    ] as (keyof Error)[];
    allKeys.forEach((key) => {
      error[key] = normalizePaths(val[key]) as never;
    });
    return serialize(error);
  } else if (val && typeof val === 'object') {
    const normalizedValue = _.cloneDeep(val) as {[key: string]: unknown};

    Object.keys(normalizedValue).forEach((key) => {
      normalizedValue[key] = normalizePaths(normalizedValue[key]);
    });
    return serialize(normalizedValue);
  }
  return serialize(normalizePaths(val));
}

export function test(val: unknown): boolean {
  return (
    (typeof val === 'object' &&
      val &&
      Object.keys(val).some((key) =>
        shouldUpdate((val as {[key: string]: unknown})[key]),
      )) ||
    // val.message is non-enumerable in an error
    (val instanceof Error && shouldUpdate(val.message)) ||
    shouldUpdate(val)
  );
}

/**
 * Normalize paths across platforms.
 * Filters must be ran on all platforms to guard against false positives
 */
function normalizePaths<T>(value: T): T {
  if (typeof value !== 'string') {
    return value;
  }

  const cwd = process.cwd();
  const tempDir = os.tmpdir();
  const homeDir = os.homedir();

  const homeRelativeToTemp = path.relative(tempDir, homeDir);

  const runner: ((val: string) => string)[] = [
    (val) => (val.includes('keepAnsi') ? val : stripAnsi(val)),
    // Replace process.cwd with <PROJECT_ROOT>
    (val) => val.split(cwd).join('<PROJECT_ROOT>'),

    // Replace temp directory with <TEMP_DIR>
    (val) => val.split(tempDir).join('<TEMP_DIR>'),

    // Replace home directory with <HOME_DIR>
    (val) => val.split(homeDir).join('<HOME_DIR>'),

    // Handle HOME_DIR nested inside TEMP_DIR
    (val) =>
      val
        .split(`<TEMP_DIR>${path.sep + homeRelativeToTemp}`)
        .join('<HOME_DIR>'),

    // Replace the Docusaurus version with a stub
    (val) => val.split(version).join('<CURRENT_VERSION>'),

    // In case the CWD is escaped
    (val) => val.split(escapePath(cwd)).join('<PROJECT_ROOT>'),

    // Remove win32 drive letters, C:\ -> \
    (val) => val.replace(/[a-zA-Z]:\\/g, '\\'),

    // Remove duplicate backslashes created from escapePath
    (val) => val.replace(/\\\\/g, '\\'),

    // Convert win32 backslash's to forward slashes, \ -> /;
    // ignore some that look like escape sequences.
    (val) => val.replace(/\\(?!")/g, '/'),
  ];

  let result = value as string;
  runner.forEach((current) => {
    result = current(result);
  });

  return result as T & string;
}

function shouldUpdate(value: unknown) {
  return typeof value === 'string' && normalizePaths(value) !== value;
}
