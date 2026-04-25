/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Configurable reading time calculation with support for
 * multiple languages, code block exclusion, and image counting.
 */

export interface ReadingTimeOptions {
  wordsPerMinute?: number;
  excludeCodeBlocks?: boolean;
  locale?: string;
  cjkWordsPerMinute?: number;
  includeImages?: boolean;
  imageReadingTime?: number;
}

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

const CJK_REGEX =
  /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g;

const CODE_BLOCK_REGEX = /```[\s\S]*?```|`[^`]+`/g;

const HTML_TAG_REGEX = /<\/?[^>]+(>|$)/g;

const IMAGE_REGEX = /!\[.*?\]\(.*?\)|<img[^>]*>/gi;

const FRONTMATTER_REGEX = /^---[\s\S]*?---/;

/**
 * Remove code blocks from content if configured.
 */
function stripCodeBlocks(content: string): string {
  return content.replace(CODE_BLOCK_REGEX, '');
}

/**
 * Remove HTML tags from content.
 */
function stripHtmlTags(content: string): string {
  return content.replace(HTML_TAG_REGEX, '');
}

/**
 * Remove front matter from markdown content.
 */
function stripFrontMatter(content: string): string {
  return content.replace(FRONTMATTER_REGEX, '');
}

/**
 * Count images in markdown content.
 */
function countImages(content: string): number {
  const matches = content.match(IMAGE_REGEX);
  return matches ? matches.length : 0;
}

/**
 * Check if a character is a CJK character (Chinese, Japanese, Korean).
 */
function isCJKLocale(locale: string): boolean {
  const cjkLocales = ['zh', 'ja', 'ko', 'zh-CN', 'zh-TW', 'zh-HK', 'ja-JP', 'ko-KR'];
  return cjkLocales.some(
    (l) => locale === l || locale.startsWith(`${l}-`),
  );
}

/**
 * Count words in text, with special handling for CJK characters.
 * CJK characters are counted individually as "words" since they
 * don't use space-delimited word boundaries.
 */
function countWords(text: string, locale: string): {latin: number; cjk: number} {
  const cjkMatches = text.match(CJK_REGEX);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  const withoutCjk = text.replace(CJK_REGEX, ' ');
  const latinWords = withoutCjk
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const latinCount = latinWords.length;

  return {latin: latinCount, cjk: cjkCount};
}

/**
 * Format reading time into human-readable text.
 */
function formatReadingTime(minutes: number, locale: string): string {
  const roundedMinutes = Math.max(1, Math.ceil(minutes));

  if (isCJKLocale(locale)) {
    return `${roundedMinutes} 分钟阅读`;
  }

  if (roundedMinutes === 1) {
    return '1 min read';
  }
  return `${roundedMinutes} min read`;
}

/**
 * Calculate reading time for the given content.
 *
 * @param content - The markdown content to analyze
 * @param options - Configuration options
 * @returns Reading time result with minutes, word count, and formatted text
 */
export function calculateReadingTime(
  content: string,
  options: ReadingTimeOptions = {},
): ReadingTimeResult {
  const {
    wordsPerMinute = 200,
    excludeCodeBlocks = true,
    locale = 'en',
    cjkWordsPerMinute = 500,
    includeImages = true,
    imageReadingTime = 12,
  } = options;

  if (!content || content.trim().length === 0) {
    return {minutes: 0, words: 0, text: '0 min read'};
  }

  let processedContent = stripFrontMatter(content);

  // Count images before stripping
  const imageCount = includeImages ? countImages(processedContent) : 0;

  if (excludeCodeBlocks) {
    processedContent = stripCodeBlocks(processedContent);
  }

  processedContent = stripHtmlTags(processedContent);

  const {latin, cjk} = countWords(processedContent, locale);
  const totalWords = latin + cjk;

  // Calculate reading time
  let readingMinutes = 0;

  if (isCJKLocale(locale)) {
    // For CJK locales, use CJK words per minute for all content
    readingMinutes = totalWords / cjkWordsPerMinute;
  } else {
    // For non-CJK locales, split calculation
    readingMinutes = latin / wordsPerMinute + cjk / cjkWordsPerMinute;
  }

  // Add image reading time (decreasing per image, minimum 3 seconds)
  if (includeImages && imageCount > 0) {
    let imageSeconds = 0;
    for (let i = 0; i < imageCount; i++) {
      const perImageTime = Math.max(3, imageReadingTime - i);
      imageSeconds += perImageTime;
    }
    readingMinutes += imageSeconds / 60;
  }

  const text = formatReadingTime(readingMinutes, locale);

  return {
    minutes: Math.round(readingMinutes * 100) / 100,
    words: totalWords,
    text,
  };
}
