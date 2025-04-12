/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
interface ReadingTimeOptions {
  wordsPerMinute?: number;
  locale?: string;
}

interface ReadingTimeResult {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

const DEFAULT_WORDS_PER_MINUTE = 200;
const DEFAULT_LOCALE = 'en';

export function calculateReadingTime(
  content: string,
  options: ReadingTimeOptions = {},
): ReadingTimeResult {
  const wordsPerMinute = options.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');

  const segmenter = new Intl.Segmenter(locale, {granularity: 'word'});
  const segments = segmenter.segment(contentWithoutFrontmatter);

  let wordCount = 0;
  for (const segment of segments) {
    if (segment.isWordLike) {
      wordCount += 1;
    }
  }

  const minutes = wordCount / wordsPerMinute;
  const time = Math.round(minutes * 60 * 1000);
  const displayed = Math.ceil(minutes);

  return {
    text: `${displayed} min read`,
    minutes,
    time,
    words: wordCount,
  };
}
