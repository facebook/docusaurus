/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import pico from 'picocolors';

type InterpolatableValue = string | number | (string | number)[];

const path: import('picocolors/types').Formatter = (msg) =>
  pico.cyan(pico.underline(msg));
const id: import('picocolors/types').Formatter = (msg) =>
  pico.blue(pico.bold(msg));
const code: import('picocolors/types').Formatter = (msg) =>
  pico.cyan(`\`${msg}\``);
const subdue = pico.gray;
const num = pico.yellow;

function interpolate(
  msgs: TemplateStringsArray,
  ...values: InterpolatableValue[]
): string {
  let res = '';
  values.forEach((value, idx) => {
    const flag = msgs[idx].match(/[a-z]+=$/);
    res += msgs[idx].replace(/[a-z]+=$/, '');
    const format = (function () {
      if (!flag) {
        return (a: string | number) => a;
      }
      switch (flag[0]) {
        case 'path=':
          return path;
        case 'number=':
          return num;
        case 'name=':
          return id;
        case 'subdue=':
          return subdue;
        case 'code=':
          return code;
        default:
          throw new Error(
            'Bad Docusaurus logging message. This is likely an internal bug, please report it.',
          );
      }
    })();
    res += Array.isArray(value)
      ? `\n- ${value.map((v) => format(v)).join('\n- ')}`
      : format(value);
  });
  res += msgs.slice(-1)[0];
  return res;
}

function info(msg: any): void;
function info(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function info(msg: any, ...values: InterpolatableValue[]): void {
  console.info(
    `${pico.cyan(pico.bold('[INFO]'))} ${
      values.length === 0
        ? msg
        : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}
function warn(msg: any): void;
function warn(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function warn(msg: any, ...values: InterpolatableValue[]): void {
  console.warn(
    pico.yellow(
      `${pico.bold('[WARNING]')} ${
        values.length === 0
          ? msg
          : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function error(msg: any): void;
function error(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function error(msg: any, ...values: InterpolatableValue[]): void {
  console.error(
    pico.red(
      `${pico.bold('[ERROR]')} ${
        values.length === 0
          ? msg
          : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function success(msg: any): void;
function success(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function success(msg: any, ...values: InterpolatableValue[]): void {
  console.log(
    `${pico.green(pico.bold('[SUCCESS]'))} ${
      values.length === 0
        ? msg
        : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}

const logger = {
  ...pico,
  path,
  id,
  code,
  subdue,
  num,
  interpolate,
  info,
  warn,
  error,
  success,
};

export default logger;
