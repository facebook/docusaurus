/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pico from 'picocolors';

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

const pathC: import('picocolors/types').Formatter = (msg) =>
  pico.cyan(pico.underline(msg));
const idC: import('picocolors/types').Formatter = (msg) =>
  pico.blue(pico.bold(msg));
const errorC = pico.red;
const codeC: import('picocolors/types').Formatter = (msg) =>
  pico.cyan(`\`${msg}\``);
const subdueC = pico.gray;
const warnC = pico.yellow;
const successC = pico.green;
const numC = pico.yellow;

const logger = {
  ...pico,
  pathC,
  idC,
  errorC,
  codeC,
  subdueC,
  warnC,
  successC,
  numC,
  interpolate(msg: string, ...values: InterpolatableValue[]): string {
    let index = 0;
    function replacer(match: string) {
      if (index >= values.length) {
        return match;
      }
      const newStr = values[index];
      index += 1;
      if (match === '%a') {
        assertIsArray(newStr);
        return `\n- ${newStr.join('\n- ')}\n`;
      }
      assertIsStrNum(newStr);
      switch (match) {
        case '%p':
          return pathC(newStr);
        case '%c':
          return codeC(newStr);
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
  },
  info(msg: string, ...values: InterpolatableValue[]): void {
    console.info(
      `${pico.cyan(pico.bold('[INFO] '))}${this.interpolate(msg, ...values)}`,
    );
  },
  warn(msg: string, ...values: InterpolatableValue[]): void {
    console.warn(
      `${pico.yellow(pico.bold('[WARNING] '))}${this.interpolate(
        msg,
        ...values,
      )}`,
    );
  },
  error(msg: string, ...values: InterpolatableValue[]): void {
    console.error(
      `${pico.red(pico.bold('[ERROR] '))}${this.interpolate(msg, ...values)}`,
    );
  },
  success(msg: string, ...values: InterpolatableValue[]): void {
    console.log(
      `${pico.green(pico.bold('[SUCCESS] '))}${this.interpolate(
        msg,
        ...values,
      )}`,
    );
  },
};

export default logger;
