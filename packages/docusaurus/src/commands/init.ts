/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {CLIOptions} from '../server';

export async function init(
  projectDir: string,
  cliOptions: CLIOptions = {},
): Promise<void> {
  console.log('Init command invoked ...');
  console.log(projectDir);
  console.log(cliOptions);

  // TODO
}
