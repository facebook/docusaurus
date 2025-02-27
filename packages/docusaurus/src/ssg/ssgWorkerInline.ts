/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadSSGRenderer, type SSGResult} from './ssgRenderer';
import type {SSGParams} from './ssgParams';

// "inline" means in the current thread, not in a worker
export async function executeSSGInlineTask(arg: {
  pathnames: string[];
  params: SSGParams;
}): Promise<SSGResult[]> {
  const appRenderer = await loadSSGRenderer({params: arg.params});
  const ssgResults = appRenderer.renderPathnames(arg.pathnames);
  await appRenderer.shutdown();
  return ssgResults;
}
