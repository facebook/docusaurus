/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pico from 'picocolors';

export const pathC = pico.magenta;
export const idC = pico.blue;
export const errorC = pico.red;
export const codeC = pico.blue;
export const subdueC = pico.gray;
export const warnC = pico.yellow;
export const successC = pico.green;

export function log(msg: string): void {
  console.info(`${pico.bold('[LOG] ')}${msg}`);
}

export function info(msg: string): void {
  console.info(`${pico.cyan(pico.bold('[INFO] '))}${msg}`);
}

export function warn(msg: string): void {
  console.info(`${pico.yellow(pico.bold('[WARNING] '))}${msg}`);
}

export function error(msg: string): void {
  console.info(`${pico.red(pico.bold('[ERROR] '))}${msg}`);
}

export function success(msg: string): void {
  console.info(`${pico.green(pico.bold('[SUCCESS] '))}${msg}`);
}
