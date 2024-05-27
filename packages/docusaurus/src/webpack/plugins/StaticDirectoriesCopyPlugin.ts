/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import type {Props} from '@docusaurus/types';

export async function createStaticDirectoriesCopyPlugin({
  props,
}: {
  props: Props;
}): Promise<CopyWebpackPlugin | undefined> {
  const {
    outDir,
    siteDir,
    siteConfig: {staticDirectories: staticDirectoriesOption},
  } = props;

  // The staticDirectories option can contain empty directories, or non-existent
  // directories (e.g. user deleted `static`). Instead of issuing an error, we
  // just silently filter them out, because user could have never configured it
  // in the first place (the default option should always "work").
  const staticDirectories: string[] = (
    await Promise.all(
      staticDirectoriesOption.map(async (dir) => {
        const staticDir = path.resolve(siteDir, dir);
        if (
          (await fs.pathExists(staticDir)) &&
          (await fs.readdir(staticDir)).length > 0
        ) {
          return staticDir;
        }
        return '';
      }),
    )
  ).filter(Boolean);

  if (staticDirectories.length === 0) {
    return undefined;
  }

  return new CopyWebpackPlugin({
    patterns: staticDirectories.map((dir) => ({
      from: dir,
      to: outDir,
      toType: 'dir',
    })),
  });
}
