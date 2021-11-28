/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pico from 'picocolors';

type InterpolatableValue = string | number | string[] | number[];

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
    const flag = msgs[idx].match(/%[a-z]+$/);
    const cleanValue = Array.isArray(value)
      ? `\n- ${value.join('\n- ')}`
      : String(value);
    res += msgs[idx].replace(/%[a-z]+$/, '');
    if (!flag) {
      res += cleanValue;
      return;
    }
    switch (flag[0]) {
      case '%p':
        res += path(cleanValue);
        break;
      case '%n':
        res += num(cleanValue);
        break;
      case '%i':
        res += id(cleanValue);
        break;
      case '%s':
        res += subdue(cleanValue);
        break;
      case '%c':
        res += code(cleanValue);
        break;
      default:
        throw new Error(
          'Bad Docusaurus logging message. This is likely an internal bug, please report it',
        );
    }
  });
  res += msgs.slice(-1)[0];
  return res;
}

function info(msg: string): void;
function info(
  msg: TemplateStringsArray,
  ...values: InterpolatableValue[]
): void;
function info(
  msg: TemplateStringsArray | string,
  ...values: InterpolatableValue[]
): void {
  if (typeof msg === 'string') {
    console.info(`${pico.cyan(pico.bold('[INFO]'))} ${msg}`);
    return;
  }
  console.info(
    `${pico.cyan(pico.bold('[INFO]'))} ${interpolate(msg, ...values)}`,
  );
}
function warn(msg: string): void;
function warn(
  msg: TemplateStringsArray,
  ...values: InterpolatableValue[]
): void;
function warn(
  msg: TemplateStringsArray | string,
  ...values: InterpolatableValue[]
): void {
  if (typeof msg === 'string') {
    console.warn(pico.yellow(`${pico.bold('[WARNING]')} ${msg}`));
    return;
  }
  console.warn(
    pico.yellow(`${pico.bold('[WARNING]')} ${interpolate(msg, ...values)}`),
  );
}
function error(msg: string | Error): void;
function error(
  msg: TemplateStringsArray,
  ...values: InterpolatableValue[]
): void;
function error(
  msg: TemplateStringsArray | Error | string,
  ...values: InterpolatableValue[]
): void {
  if (msg instanceof Error) {
    console.error(msg);
    return;
  }
  if (typeof msg === 'string') {
    console.error(pico.red(`${pico.bold('[ERROR]')} ${msg}`));
    return;
  }
  console.error(
    pico.red(`${pico.bold('[ERROR]')} ${interpolate(msg, ...values)}`),
  );
}
function success(msg: string): void;
function success(
  msg: TemplateStringsArray,
  ...values: InterpolatableValue[]
): void;
function success(
  msg: TemplateStringsArray | string,
  ...values: InterpolatableValue[]
): void {
  if (typeof msg === 'string') {
    console.log(`${pico.green(pico.bold('[SUCCESS]'))} ${msg}`);
    return;
  }
  console.log(
    `${pico.green(pico.bold('[SUCCESS]'))} ${interpolate(msg, ...values)}`,
  );
}

const logger = {
  ...pico,
  path,
  id,
  code,
  subdue,
  interpolate,
  num,
  info,
  warn,
  error,
  success,
};

export default logger;
