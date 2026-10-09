/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PQueue from 'p-queue';

// Large sites can read/write a file for each of their thousands of docs/blog
// posts concurrently. We bound how many files we keep open at once to avoid
// EMFILE errors ("too many open files"): node:fs doesn't queue and retry
// operations failing with EMFILE like graceful-fs (used by fs-extra) does.
const FileOperationQueue = new PQueue({concurrency: 100});

/**
 * Runs a file system operation (that keeps a file open, like `readFile()` or
 * `writeFile()`) through a shared queue, bounding how many files are open at
 * the same time. Use it when processing many files concurrently.
 * Don't nest calls: the inner operation could wait for a free slot forever.
 */
export function queueFileOperation<T>(operation: () => Promise<T>): Promise<T> {
  return FileOperationQueue.add(operation);
}
