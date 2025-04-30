/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import readingTime from 'reading-time';

const DEFAULT_WORDS_PER_MINUTE = 200;

interface ReadingTimeOptions {
  wordsPerMinute?: number;
  wordBound?: (char: string) => boolean;
}

/**
 * Calculates the reading time for a given content string.
 * Uses the reading-time package under the hood.
 */
export function calculateReadingTime(
  content: string,
  options: ReadingTimeOptions = {},
): number {
  const wordsPerMinute = options.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE;
  const {wordBound} = options;
  return readingTime(content, {wordsPerMinute, ...(wordBound && {wordBound})})
    .minutes;
}
