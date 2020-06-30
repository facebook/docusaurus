/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from 'chalk';
import {execSync} from 'child_process';

const execOptions: object = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', // stderr
  ],
};

// Gets process id of what is on port
function getProcessIdOnPort(port: number): string {
  return execSync(`lsof -i:${port} -P -t -sTCP:LISTEN`, execOptions)
    .toString()
    .split('\n')[0]
    .trim();
}

// Gets process command
function getProcessCommand(processId: string): Promise<string | null> | string {
  let command: Buffer | string = execSync(
    `ps -o command -p ${processId} | sed -n 2p`,
    execOptions,
  );

  command = command.toString().replace(/\n$/, '');

  return command;
}

// Gets directory of a process from its process id
function getDirectoryOfProcessById(processId: string): string {
  return execSync(
    `lsof -p ${processId} | awk '$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}'`,
    execOptions,
  )
    .toString()
    .trim();
}

// Gets process on port
export default function getProcessForPort(port: number): string | null {
  try {
    const processId = getProcessIdOnPort(port);
    const directory = getDirectoryOfProcessById(processId);
    const command = getProcessCommand(processId);
    return (
      chalk.cyan(command) +
      chalk.grey(` (pid ${processId})\n`) +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    );
  } catch (e) {
    return null;
  }
}
