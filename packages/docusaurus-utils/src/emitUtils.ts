/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {createHash} from 'crypto';
import {findAsyncSequential} from './jsUtils';

const fileHash = new Map<string, string>();

const hashContent = (content: string): string => {
  return createHash('md5').update(content).digest('hex');
};

/**
 * Outputs a file to the generated files directory. Only writes files if content
 * differs from cache (for hot reload performance).
 *
 * @param generatedFilesDir Absolute path.
 * @param file Path relative to `generatedFilesDir`. File will always be
 * outputted; no need to ensure directory exists.
 * @param content String content to write.
 * @param skipCache If `true` (defaults as `true` for production), file is
 * force-rewritten, skipping cache.
 */
export async function generate(
  generatedFilesDir: string,
  file: string,
  content: string,
  skipCache: boolean = process.env.NODE_ENV === 'production',
): Promise<void> {
  const filepath = path.resolve(generatedFilesDir, file);

  if (skipCache) {
    await fs.outputFile(filepath, content);
    // Cache still needs to be reset, otherwise, writing "A", "B", and "A" where
    // "B" skips cache will cause the last "A" not be able to overwrite as the
    // first "A" remains in cache. But if the file never existed in cache, no
    // need to register it.
    if (fileHash.get(filepath)) {
      fileHash.set(filepath, hashContent(content));
    }
    return;
  }

  let lastHash = fileHash.get(filepath);

  // If file already exists but it's not in runtime cache yet, we try to
  // calculate the content hash and then compare. This is to avoid unnecessary
  // overwriting and we can reuse old file.
  if (!lastHash && (await fs.pathExists(filepath))) {
    const lastContent = await fs.readFile(filepath, 'utf8');
    lastHash = hashContent(lastContent);
    fileHash.set(filepath, lastHash);
  }

  const currentHash = hashContent(content);

  if (lastHash !== currentHash) {
    await fs.outputFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}

/**
 * @param permalink The URL that the HTML file corresponds to, without base URL
 * @param outDir Full path to the output directory
 * @param trailingSlash The site config option. If provided, only one path will
 * be read.
 * @returns This returns a buffer, which you have to decode string yourself if
 * needed. (Not always necessary since the output isn't for human consumption
 * anyways, and most HTML manipulation libs accept buffers)
 * @throws Throws when the HTML file is not found at any of the potential paths.
 * This should never happen as it would lead to a 404.
 */
export async function readOutputHTMLFile(
  permalink: string,
  outDir: string,
  trailingSlash: boolean | undefined,
): Promise<Buffer> {
  const normalizedPermalink = permalink.replace(/\/$/, '');
  const withTrailingSlashPath = path.join(
    outDir,
    normalizedPermalink,
    'index.html',
  );
  const withoutTrailingSlashPath = path.join(outDir, normalizedPermalink);
  const isHtmlPath = /\.html?$/i.test(normalizedPermalink);

  const possibleHtmlPaths = isHtmlPath
    ? [withoutTrailingSlashPath]
    : trailingSlash === true
      ? [withTrailingSlashPath]
      : trailingSlash === false
        ? [`${withoutTrailingSlashPath}.html`]
        : [withTrailingSlashPath, `${withoutTrailingSlashPath}.html`];

  async function readCandidateHTMLFile(
    candidatePath: string,
  ): Promise<Buffer | null> {
    if (!(await fs.pathExists(candidatePath))) {
      return null;
    }
    try {
      return await fs.readFile(candidatePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code !== 'EISDIR') {
        throw error;
      }
    }

    const candidateIndexPath = path.join(candidatePath, 'index.html');
    if (await fs.pathExists(candidateIndexPath)) {
      return fs.readFile(candidateIndexPath);
    }

    return null;
  }

  const HTMLPath = await findAsyncSequential(possibleHtmlPaths, async (p) =>
    Boolean(await readCandidateHTMLFile(p)),
  );

  if (!HTMLPath) {
    throw new Error(
      `Expected output HTML file to be found at ${possibleHtmlPaths[0]} for permalink ${permalink}.`,
    );
  }

  const content = await readCandidateHTMLFile(HTMLPath);
  if (!content) {
    throw new Error(
      `Expected output HTML file to be found at ${HTMLPath} for permalink ${permalink}.`,
    );
  }
  return content;
}
