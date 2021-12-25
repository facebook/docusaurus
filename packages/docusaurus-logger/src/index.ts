/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk, {Chalk} from 'chalk';

type InterpolatableValue = string | number | (string | number)[];

const path = (msg: unknown): string => chalk.cyan(chalk.underline(msg));
const name = (msg: unknown): string => chalk.blue(chalk.bold(msg));
const code = (msg: unknown): string => chalk.cyan(`\`${msg}\``);
const subdue: Chalk = chalk.gray;
const num: Chalk = chalk.yellow;

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
          return name;
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

function info(msg: unknown): void;
function info(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function info(msg: unknown, ...values: InterpolatableValue[]): void {
  console.info(
    `${chalk.cyan(chalk.bold('[INFO]'))} ${
      values.length === 0
        ? msg
        : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}
function warn(msg: unknown): void;
function warn(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function warn(msg: unknown, ...values: InterpolatableValue[]): void {
  console.warn(
    chalk.yellow(
      `${chalk.bold('[WARNING]')} ${
        values.length === 0
          ? msg
          : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function error(msg: unknown): void;
function error(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function error(msg: unknown, ...values: InterpolatableValue[]): void {
  console.error(
    chalk.red(
      `${chalk.bold('[ERROR]')} ${
        values.length === 0
          ? msg
          : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function success(msg: unknown): void;
function success(
  msg: TemplateStringsArray,
  ...values: [InterpolatableValue, ...InterpolatableValue[]]
): void;
function success(msg: unknown, ...values: InterpolatableValue[]): void {
  console.log(
    `${chalk.green(chalk.bold('[SUCCESS]'))} ${
      values.length === 0
        ? msg
        : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}

const logger = {
  red: chalk.red,
  yellow: chalk.yellow,
  green: chalk.green,
  bold: chalk.bold,
  dim: chalk.dim,
  path,
  name,
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
