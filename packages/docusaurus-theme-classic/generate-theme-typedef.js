/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const {spawnSync} = require('child_process');
const {writeFileSync, readFileSync} = require('fs');
const {join} = require('path');

const TARGET = join('lib', 'index.d.ts');

spawnSync(
  'yarn',
  [
    'tsc',
    '--declaration',
    '--resolveJsonModule',
    'false',
    '--noEmit',
    'false',
    '--outFile',
    TARGET,
    '--emitDeclarationOnly',
  ],
  {shell: true, stdio: 'inherit'},
);

writeFileSync(
  TARGET,
  readFileSync(TARGET)
    .toString()
    .replace(/declare module "/g, 'declare module "@theme/')
    .replace(/\/index/g, '')
    .replace(/import '\.\/styles\.css';/g, ''),
);
