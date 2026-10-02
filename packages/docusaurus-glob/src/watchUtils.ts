/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Chokidar is the lib we use in Docusaurus to watch files

import path from 'node:path';
import * as Chokidar from 'chokidar';
import micromatch from 'micromatch';

/**
 * Our own watch options: we only expose the options we actually use, so that
 * we can upgrade or swap the underlying lib.
 */
export type WatchOptions = Pick<
  Chokidar.ChokidarOptions,
  'cwd' | 'usePolling' | 'interval'
>;

type WatchEventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

/** Our own file watcher handle, exposing only the APIs we actually use. */
export type Watcher = {
  on: ((
    event: 'all',
    listener: (eventName: WatchEventName, path: string) => void,
  ) => Watcher) &
    ((event: 'ready', listener: () => void) => Watcher);
  close: () => Promise<void>;
};

function posixPath(p: string): string {
  return p.replaceAll('\\', '/');
}

/**
 * Chokidar v4+ removed glob support. We watch the base dir of each glob, and
 * ignore the files that don't match any glob.
 * See https://github.com/paulmillr/chokidar/discussions/1423
 */
function createWatchTargets(paths: string[], cwd: string) {
  const resolve = (p: string) => posixPath(path.resolve(cwd, p));

  const plainPaths: string[] = [];
  const globBases: string[] = [];
  const globs: string[] = [];
  const negatedGlobs: string[] = [];

  for (const p of paths.map(posixPath)) {
    if (p.startsWith('!')) {
      negatedGlobs.push(resolve(p.slice(1)));
      continue;
    }
    const {base, isGlob} = micromatch.scan(p);
    if (isGlob) {
      globBases.push(resolve(base));
      globs.push(resolve(p));
    } else {
      plainPaths.push(resolve(p));
    }
  }

  const createMatcher = (patterns: string[]) => {
    const matchers = patterns.map((p) => micromatch.matcher(p, {dot: true}));
    return (absPath: string) => matchers.some((matcher) => matcher(absPath));
  };
  const isGlobMatch = createMatcher(globs);
  const isNegatedMatch = createMatcher(negatedGlobs);
  const isInPlainPath = (absPath: string) =>
    plainPaths.some((p) => absPath === p || absPath.startsWith(`${p}/`));

  return {
    targets: [...new Set([...plainPaths, ...globBases])],
    isMatch(filePath: string): boolean {
      const absPath = resolve(filePath);
      return (
        !isNegatedMatch(absPath) &&
        (isInPlainPath(absPath) || isGlobMatch(absPath))
      );
    },
  };
}

/**
 * Watches file system paths for changes.
 * Only emits events for changes happening after the watcher is created.
 */
export function watch(
  paths: string | string[],
  options?: WatchOptions,
): Watcher {
  const {targets, isMatch} = createWatchTargets(
    [paths].flat(),
    options?.cwd ?? process.cwd(),
  );
  // Chokidar "all" listeners only receive file events (WatchEventName)
  return Chokidar.watch(targets, {
    // Other lib options are still forwarded at runtime for retro-compatibility
    ...options,
    ignoreInitial: true,
    // Dirs can't be ignored: they may contain matching files
    ignored: (filePath, stats) => !!stats?.isFile() && !isMatch(filePath),
  }) as unknown as Watcher;
}
