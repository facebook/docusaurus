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
import fs from 'fs';
import _ from 'lodash';
import {escapePath} from '@docusaurus/utils';
import {version} from '@docusaurus/core/package.json';
import stripAnsi from 'strip-ansi';

/*
This weird thing is to normalize paths on our Windows GitHub Actions runners

For some reason, os.tmpdir() returns the "legacy 8.3 DOS short paths"
This prevents snapshot normalization on Windows

      tempDir: 'C:\\Users\\RUNNER~1\\AppData\\Local\\Temp',
      tempDirReal: 'C:\\Users\\RUNNER~1\\AppData\\Local\\Temp',
      homeDir: 'C:\\Users\\runneradmin',
      homeDirReal: 'C:\\Users\\runneradmin',
 */
function normalizeWindowTempDirShortPath(str: string): string {
  return str.replace('\\RUNNER~1\\', '\\runneradmin\\');
}

function readPathsForNormalization() {
  const cwd = process.cwd();

  const tempDir = os.tmpdir();
  const homeDir = os.homedir();

  // Can we get rid of this legacy sync FS function?
  function getRealPathSync(pathname: string): string {
    try {
      // eslint-disable-next-line no-restricted-properties
      return fs.realpathSync(pathname);
    } catch (err) {
      return pathname;
    }
  }

  const tempDirReal = getRealPathSync(tempDir);
  const homeDirReal = getRealPathSync(homeDir);

  return {
    cwd,
    tempDir: normalizeWindowTempDirShortPath(tempDir),
    tempDirReal: normalizeWindowTempDirShortPath(tempDirReal),
    homeDir,
    homeDirReal,
  };
}

// We memoize it to avoid useless FS calls on each path normalization
const getPathsForNormalization: typeof readPathsForNormalization = _.memoize(
  readPathsForNormalization,
);

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

  const {cwd, tempDir, tempDirReal, homeDir, homeDirReal} =
    getPathsForNormalization();

  const homeRelativeToTemp = path.relative(tempDir, homeDir);

  const runner: ((val: string) => string)[] = [
    (val) => (val.includes('keepAnsi') ? val : stripAnsi(val)),
    // Replace process.cwd with <PROJECT_ROOT>
    (val) => val.split(cwd).join('<PROJECT_ROOT>'),

    // Replace temp directory with <TEMP_DIR>
    (val) => val.split(tempDirReal).join('<TEMP_DIR>'),
    (val) => val.split(tempDir).join('<TEMP_DIR>'),

    (val) => val.split(tempDirReal).join('<TEMP_DIR>'),
    (val) => val.split(tempDir).join('<TEMP_DIR>'),

    // Replace home directory with <HOME_DIR>
    (val) => val.split(homeDirReal).join('<HOME_DIR>'),
    (val) => val.split(homeDir).join('<HOME_DIR>'),

    // Handle HOME_DIR nested inside TEMP_DIR
    // This happens on windows GitHub actions runners
    // tempDir: 'C:\\Users\\RUNNER~1\\AppData\\Local\\Temp',
    // homeDir: 'C:\\Users\\runneradmin',
    (val) =>
      val
        .split(`<TEMP_DIR>${path.sep + homeRelativeToTemp}`)
        .join('<HOME_DIR>'),

    // replace /prefix___MKDTEMP_DIR___ABC123 with /prefix<MKDTEMP_DIR_STABLE>
    // The random 6-char suffix of mkdtemp() is removed to make snapshots stable
    (val) => {
      const [before, after] = val.split('___MKDTEMP_DIR___');
      if (after) {
        const afterSub = after.substring(6);
        return [before, afterSub].join('<MKDTEMP_DIR_STABLE>');
      }
      return before;
    },

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
