/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// We use cross-spawn instead of spawn because of Windows compatibility issues.
// For example, "yarn" doesn't work on Windows, it requires "yarn.cmd"
import crossSpawn from 'cross-spawn';
import {
  PackageManagers,
  type PackageManager,
  type GitCloneStrategy,
  type Source,
} from './constants.js';
import {askForCustomGitCloneCommand} from './prompts.js';

// This is the same as node's child_process.SpawnOptions type, but extract from
// cross-spawn directly to ensure direct compatibility.
type SpawnOptions = NonNullable<Parameters<typeof crossSpawn>[2]>;

type RunCommandOptions = SpawnOptions & {
  // The command output is buffered, and only printed if the command fails
  printOutputOnFailure?: boolean;
};

/**
 * Run a command, similar to execa(cmd,args) but simpler
 * @param command
 * @param args
 * @param options
 * @returns the command exit code
 */
export async function runCommand(
  command: string,
  args: string[] = [],
  {printOutputOnFailure = false, ...options}: RunCommandOptions = {},
): Promise<number> {
  // This does something similar to execa.command()
  // we split a string command (with optional args) into command+args
  // this way it's compatible with spawn()
  const [realCommand, ...baseArgs] = command.split(' ');
  const allArgs = [...baseArgs, ...args];
  if (!realCommand) {
    throw new Error(`Invalid command: ${command}`);
  }

  return new Promise<number>((resolve, reject) => {
    const p = crossSpawn(realCommand, allArgs, {
      stdio: printOutputOnFailure ? ['ignore', 'pipe', 'pipe'] : 'ignore',
      ...options,
    });

    // Chunks are kept in order, to be replayed to their original stream
    const output: [NodeJS.WriteStream, Buffer][] = [];
    p.stdout?.on('data', (chunk: Buffer) =>
      output.push([process.stdout, chunk]),
    );
    p.stderr?.on('data', (chunk: Buffer) =>
      output.push([process.stderr, chunk]),
    );

    p.on('error', reject);
    p.on('close', (exitCode) => {
      if (exitCode !== 0) {
        output.forEach(([stream, chunk]) => stream.write(chunk));
      }
      if (exitCode !== null) {
        resolve(exitCode);
      } else {
        reject(new Error(`No exit code for command ${command}`));
      }
    });
  });
}

async function hasPackageManager(
  packageManager: PackageManager,
): Promise<boolean> {
  return (await runCommand(packageManager, ['--version'])) === 0;
}

export async function getAvailablePackageManagers(): Promise<PackageManager[]> {
  const list = await Promise.all(
    PackageManagers.map(async (name) => {
      return (await hasPackageManager(name)) ? name : null;
    }),
  );
  return list.filter((item) => item !== null);
}

export async function runPackageManagerInstallCommand(
  pkgManager: PackageManager,
): Promise<boolean> {
  const installCommand =
    pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`;

  // The output is piped, so package managers can't detect color support
  // hasColors() is undefined when stdout is not a TTY
  const forceColor = process.stdout.hasColors?.() ?? false;
  // npm ignores FORCE_COLOR (pnpm 12 ignores --color=always and parses
  // "--color always" as "pnpm add always")
  const colorArgs =
    forceColor && pkgManager === 'npm' ? ['--color=always'] : [];

  return (
    (await runCommand(installCommand, colorArgs, {
      printOutputOnFailure: true,
      env: {...process.env, ...(forceColor ? {FORCE_COLOR: '1'} : {})},
    })) === 0
  );
}

async function getGitCloneCommand(
  gitStrategy: GitCloneStrategy,
): Promise<string> {
  switch (gitStrategy) {
    case 'shallow':
    case 'copy':
      return 'git clone --recursive --depth 1';
    case 'custom': {
      return askForCustomGitCloneCommand();
    }
    case 'deep':
    default:
      return 'git clone';
  }
}

export async function runGitCloneCommand(
  source: Source & {type: 'git'},
  dest: string,
): Promise<boolean> {
  const gitCommand = await getGitCloneCommand(source.strategy);
  return (
    (await runCommand(gitCommand, [source.url, dest], {
      printOutputOnFailure: true,
    })) === 0
  );
}
