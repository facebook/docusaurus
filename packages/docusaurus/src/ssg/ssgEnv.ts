/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Secret way to set SSR plugin async concurrency option
// Waiting for feedback before documenting this officially?
// TODO Docusaurus v4, rename SSR => SSG
export const SSGConcurrency = process.env.DOCUSAURUS_SSR_CONCURRENCY
  ? parseInt(process.env.DOCUSAURUS_SSR_CONCURRENCY, 10)
  : // Not easy to define a reasonable option default
    // Will still be better than Infinity
    // See also https://github.com/sindresorhus/p-map/issues/24
    32;

// Secret way to set SSR plugin async concurrency option
// Waiting for feedback before documenting this officially?
export const SSGWorkerThreadCount: number | undefined = process.env
  .DOCUSAURUS_SSG_WORKER_THREAD_COUNT
  ? parseInt(process.env.DOCUSAURUS_SSG_WORKER_THREAD_COUNT, 10)
  : undefined;

// Number of pathnames to SSG per worker task
export const SSGWorkerThreadTaskSize: number = process.env
  .DOCUSAURUS_SSG_WORKER_THREAD_TASK_SIZE
  ? parseInt(process.env.DOCUSAURUS_SSG_WORKER_THREAD_TASK_SIZE, 10)
  : 10; // TODO need fine-tuning
