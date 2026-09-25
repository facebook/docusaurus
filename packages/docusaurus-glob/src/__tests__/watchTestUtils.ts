/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ExpectStatic} from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {watch, type WatchOptions} from '../watchUtils';

// Test utils to assert the events emitted by watch() on the real file system.
//
// Events are asserted as a sorted, deduplicated list of "<event> <path>"
// strings. In practice, Docusaurus reloads on any event, so what matters most
// is which file system changes trigger at least one event.
// Creating a file may randomly emit "add" + "change" (FSEvents, Windows...),
// so we ignore "change" events of files that were added during the same step.

export type WatchMode = {
  name: string;
  options: WatchOptions;
  /**
   * Chokidar v3 uses macOS FSEvents by default. It behaves differently from
   * the Node.js fs.watch() and fs.watchFile() (polling) based implementations.
   * Chokidar v4+ removed FSEvents support.
   */
  isFsEvents: boolean;
};

export const WatchModes: WatchMode[] = [
  {
    name: 'native',
    options: {},
    isFsEvents: process.platform === 'darwin',
  },
  {
    name: 'polling',
    // Same options as "docusaurus start --poll 50"
    options: {usePolling: true, interval: 50},
    isFsEvents: false,
  },
];

// TODO Chokidar v3 race: a file written right after its parent dir is created
//  may be missed (seen on Windows CI in polling mode), so we retry there
export const retry = process.platform === 'win32' ? 2 : 0;

// Time to wait for extra/unexpected events once expected events are received
const QuietDelay = 500;
// Max time to wait for expected events
const EventsTimeout = 5000;
// Let the FS settle, FSEvents may report changes that happened before watching
const SettleDelay = 300;

export function posixPath(p: string): string {
  return p.replaceAll('\\', '/');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeFiles(dir: string, files: string[]): Promise<void> {
  for (const file of files) {
    const filePath = path.join(dir, file);
    await fs.mkdir(path.dirname(filePath), {recursive: true});
    await fs.writeFile(filePath, `content of ${file}`);
  }
}

export type TestDirs = {
  /** Temp dir, parent of siteDir, to test paths outside of the site */
  rootDir: string;
  /** Site dir, used as the watcher "cwd" by default */
  siteDir: string;
};

/**
 * All file paths are relative to siteDir.
 * Use "../" for file paths outside siteDir.
 */
export type TestWatcher = TestDirs & {
  /** Events emitted before any file system operation */
  initialEvents: string[];
  /** Create files, and their parent dirs if needed */
  add: (...files: string[]) => Promise<void>;
  /** Update existing files */
  change: (...files: string[]) => Promise<void>;
  /** Remove files or dirs */
  remove: (...files: string[]) => Promise<void>;
  /** Rename or move a file or dir */
  rename: (from: string, to: string) => Promise<void>;
  /**
   * Update a file with an "atomic write", like many editors do: write a temp
   * file and then rename it to replace the original file.
   */
  atomicChange: (file: string) => Promise<void>;
  /**
   * Run file system operations, wait for the expected events, and assert
   * that they are the only events emitted.
   * Optional events may or may not be emitted (non-deterministic behavior).
   */
  expectEvents: (
    action: () => Promise<void>,
    expected: string[],
    options?: {optional?: string[]},
  ) => Promise<void>;
} & AsyncDisposable;

export async function createTestWatcher({
  expect,
  mode,
  files = [],
  paths,
  options,
}: {
  expect: ExpectStatic;
  mode: WatchMode;
  /** Files to create before watching */
  files?: string[];
  paths: (dirs: TestDirs) => string | string[];
  options?: (dirs: TestDirs) => WatchOptions;
}): Promise<TestWatcher> {
  const tmp = await fs.mkdtempDisposable(
    path.join(await fs.realpath(tmpdir()), 'docusaurus-watch-'),
  );
  const rootDir = tmp.path;
  const siteDir = path.join(rootDir, 'site');
  const dirs = {rootDir, siteDir};
  await fs.mkdir(siteDir);
  await writeFiles(siteDir, files);
  await sleep(SettleDelay);

  const events: string[] = [];
  const watcher = watch(paths(dirs), {
    cwd: siteDir,
    ...mode.options,
    ...options?.(dirs),
  });
  watcher.on('all', (name, eventPath) => {
    events.push(`${name} ${posixPath(eventPath)}`);
  });
  await new Promise((resolve) => watcher.on('ready', resolve));
  await sleep(SettleDelay);
  const initialEvents = [...events];

  const resolve = (file: string) => path.join(siteDir, file);

  async function waitForEvents(expected: string[]): Promise<string[]> {
    const start = Date.now();
    while (
      !expected.every((e) => events.includes(e)) &&
      Date.now() - start < EventsTimeout
    ) {
      await sleep(50);
    }
    await sleep(QuietDelay);
    return [...new Set(events)]
      .filter(
        (event) =>
          !event.startsWith('change ') ||
          !events.includes(event.replace(/^change /, 'add ')),
      )
      .sort();
  }

  const rename = (from: string, to: string) =>
    fs.rename(resolve(from), resolve(to));

  return {
    ...dirs,
    initialEvents,
    add: (...addedFiles) => writeFiles(siteDir, addedFiles),
    change: async (...changedFiles) => {
      for (const file of changedFiles) {
        await fs.writeFile(resolve(file), `updated content of ${file}`);
      }
    },
    remove: async (...removedFiles) => {
      for (const file of removedFiles) {
        await fs.rm(resolve(file), {recursive: true});
      }
    },
    rename,
    atomicChange: async (file) => {
      const tempFile = `${file}.tmp`;
      await fs.writeFile(resolve(tempFile), `atomic content of ${file}`);
      await rename(tempFile, file);
    },
    async expectEvents(action, expected, {optional = []} = {}) {
      events.length = 0;
      await action();
      const received = await waitForEvents(expected);
      const unexpectedOptional = (event: string) =>
        optional.includes(event) && !expected.includes(event);
      expect(received.filter((e) => !unexpectedOptional(e))).toEqual(
        [...expected].sort(),
      );
    },
    async [Symbol.asyncDispose]() {
      await watcher.close();
      await tmp[Symbol.asyncDispose]();
    },
  };
}
