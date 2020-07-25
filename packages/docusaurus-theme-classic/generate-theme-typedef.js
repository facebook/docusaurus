/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const {spawnSync} = require('child_process');
const {mkdirSync, writeFileSync, readFileSync, unlinkSync} = require('fs');
const {dirname} = require('path');

const TARGET = 'lib/index.d.ts';

mkdirSync(dirname(TARGET), {recursive: true});
writeFileSync(TARGET, '');

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
    'temp.d.ts',
    '--emitDeclarationOnly',
  ],
  {shell: true, stdio: 'inherit'},
);

writeFileSync(
  TARGET,
  readFileSync('temp.d.ts')
    .toString()
    .replace(/declare module "/g, 'declare module "@theme/')
    .replace(/\/index/g, '')
    .replace(/import '\.\/styles\.css';/g, ''),
);
unlinkSync('temp.d.ts');
unlinkSync('temp.d.ts.map');
