/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pico from 'picocolors';

export const pathC = pico.magenta;
export const idC = pico.cyan;
export const errorC = pico.red;
export const codeC = pico.cyan;
export const subdueC = pico.gray;
export const warnC = pico.yellow;
export const successC = pico.green;
export const numC = pico.yellow;

type InterpolatableValue = string | number | string[];

function assertIsArray(value: InterpolatableValue): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new Error(
      'Bad Docusaurus logging message. This is likely an internal bug, please report it',
    );
  }
}

function assertIsStrNum(
  value: InterpolatableValue,
): asserts value is string | number {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(
      'Bad Docusaurus logging message. This is likely an internal bug, please report it',
    );
  }
}

function interpolate(msg: string, values: InterpolatableValue[]) {
  let index = 0;
  function replacer(match: string) {
    if (index >= values.length) {
      return match;
    }
    const newStr = values[index];
    index += 1;
    if (match === '%a') {
      assertIsArray(newStr);
      return newStr.join('\n- ');
    }
    assertIsStrNum(newStr);
    switch (match) {
      case '%p':
        return pathC(newStr);
      case '%c':
        return codeC(`\`${newStr}\``);
      case '%i':
        return idC(newStr);
      case '%n':
        return numC(newStr);
      default:
        throw new Error(
          'Bad Docusaurus logging message. This is likely an internal bug, please report it',
        );
    }
  }
  return msg.replace(/%[A-Za-z]/g, replacer);
}

export function log(msg: string, ...values: InterpolatableValue[]): void {
  console.info(`${pico.bold('[LOG] ')}${interpolate(msg, values)}`);
}

export function info(msg: string, ...values: InterpolatableValue[]): void {
  console.info(`${pico.cyan(pico.bold('[INFO] '))}${interpolate(msg, values)}`);
}

export function warn(msg: string, ...values: InterpolatableValue[]): void {
  console.info(
    `${pico.yellow(pico.bold('[WARNING] '))}${interpolate(msg, values)}`,
  );
}

export function error(msg: string, ...values: InterpolatableValue[]): void {
  console.info(`${pico.red(pico.bold('[ERROR] '))}${interpolate(msg, values)}`);
}

export function success(msg: string, ...values: InterpolatableValue[]): void {
  console.info(
    `${pico.green(pico.bold('[SUCCESS] '))}${interpolate(msg, values)}`,
  );
}
