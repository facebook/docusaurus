/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import * as chokidar from 'chokidar';
import {Globby, posixPath} from '@docusaurus/utils';
import picomatch from 'picomatch';

import type {StartCLIOptions} from './start';
import type {LoadedPlugin, Props} from '@docusaurus/types';

type PollingOptions = {
  usePolling: boolean;
  interval: number | undefined;
};

export function createPollingOptions(
  cliOptions: StartCLIOptions,
): PollingOptions {
  return {
    usePolling: !!cliOptions.poll,
    interval: Number.isInteger(cliOptions.poll)
      ? (cliOptions.poll as number)
      : undefined,
  };
}

type ChokidarEventNames = keyof chokidar.FSWatcherEventMap;

// We only subscribe to a subset of Chokidar events we care about
const FileWatchEvents = [
  'add',
  'change',
  'unlink',
  'addDir',
  'unlinkDir',
] as const satisfies ChokidarEventNames[];

export type FileWatchEventName = (typeof FileWatchEvents)[number];

export type FileWatchEvent = {
  name: FileWatchEventName;
  path: string;
};

type WatchParams = {
  pathsToWatch: string[];
  siteDir: string;
} & PollingOptions;

/**
 * Watch file system paths for changes and emit events
 * Returns an async handle to stop watching
 */
async function watch(
  params: WatchParams,
  callback: (event: FileWatchEvent) => void,
): Promise<() => Promise<void>> {
  const {pathsToWatch, siteDir, ...options} = params;

  const fsWatcher = chokidar.watch(pathsToWatch, {
    cwd: siteDir,
    ignoreInitial: true,
    ...options,
  });

  console.log('watch glob', {
    patterns: pathsToWatch,
    scans: pathsToWatch.map((pattern) => picomatch.scan(pattern).base),
    result: await Globby(pathsToWatch),
  });

  FileWatchEvents.forEach((eventName) =>
    fsWatcher.on(eventName, (eventPath) => {
      callback({name: eventName, path: eventPath});
    }),
  );

  return () => fsWatcher.close();
}

function getSitePathsToWatch({props}: {props: Props}): string[] {
  return [
    // TODO we should also watch all imported modules!
    //  Use https://github.com/vercel/nft ?
    props.siteConfigPath,
    props.localizationDir,
  ];
}

function getPluginPathsToWatch({
  siteDir,
  plugin,
}: {
  siteDir: string;
  plugin: LoadedPlugin;
}): string[] {
  const normalizeToSiteDir = (filepath: string) => {
    if (filepath && path.isAbsolute(filepath)) {
      return posixPath(path.relative(siteDir, filepath));
    }
    return posixPath(filepath);
  };

  return (plugin.getPathsToWatch?.() ?? [])
    .filter(Boolean)
    .map(normalizeToSiteDir);
}

export async function setupSiteFileWatchers(
  {
    props,
    cliOptions,
  }: {
    props: Props;
    cliOptions: StartCLIOptions;
  },
  callback: (params: {
    plugin: LoadedPlugin | null;
    event: FileWatchEvent;
  }) => void,
): Promise<void> {
  const {siteDir} = props;
  const pollingOptions = createPollingOptions(cliOptions);

  // TODO on config / or local plugin updates,
  //  the getFilePathsToWatch lifecycle code might get updated
  //  so we should probably reset the watchers?

  const siteWatcher = watch(
    {
      pathsToWatch: getSitePathsToWatch({props}),
      siteDir: props.siteDir,
      ...pollingOptions,
    },
    (event) => callback({plugin: null, event}),
  );

  const pluginWatchers = props.plugins.map((plugin) => {
    return watch(
      {
        pathsToWatch: getPluginPathsToWatch({plugin, siteDir}),
        siteDir,
        ...pollingOptions,
      },
      (event) => callback({plugin, event}),
    );
  });

  await Promise.all([siteWatcher, ...pluginWatchers]);
}
