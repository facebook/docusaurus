/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {calculateReadingTime} from '../readingTime';

describe('calculateReadingTime', () => {
  it('should return 0 for empty content', () => {
    const result = calculateReadingTime('');
    expect(result.minutes).toBe(0);
    expect(result.words).toBe(0);
    expect(result.text).toBe('0 min read');
  });

  it('should return 0 for whitespace-only content', () => {
    const result = calculateReadingTime('   \n\n  ');
    expect(result.minutes).toBe(0);
    expect(result.words).toBe(0);
  });

  it('should calculate basic reading time', () => {
    const words = Array(200).fill('word').join(' ');
    const result = calculateReadingTime(words);
    expect(result.words).toBe(200);
    expect(result.text).toBe('1 min read');
  });

  it('should handle multi-minute content', () => {
    const words = Array(600).fill('word').join(' ');
    const result = calculateReadingTime(words);
    expect(result.words).toBe(600);
    expect(result.text).toBe('3 min read');
  });

  it('should exclude code blocks when configured', () => {
    const content = `Some text here.

\`\`\`javascript
const x = 1;
const y = 2;
const z = 3;
\`\`\`

More text here.`;

    const withExclusion = calculateReadingTime(content, {
      excludeCodeBlocks: true,
    });
    const withoutExclusion = calculateReadingTime(content, {
      excludeCodeBlocks: false,
    });

    expect(withExclusion.words).toBeLessThan(withoutExclusion.words);
  });

  it('should strip inline code', () => {
    const content = 'Use `console.log` to debug `variables` in code';
    const result = calculateReadingTime(content, {excludeCodeBlocks: true});
    expect(result.words).toBeLessThan(8);
  });

  it('should strip HTML tags', () => {
    const content = '<p>Hello <strong>world</strong></p>';
    const result = calculateReadingTime(content);
    expect(result.words).toBe(2);
  });

  it('should strip front matter', () => {
    const content = `---
title: Test Post
date: 2024-01-01
---

The actual content starts here with some words.`;

    const result = calculateReadingTime(content);
    // Should not count front matter words
    expect(result.words).toBeLessThan(15);
  });

  it('should count CJK characters', () => {
    const content = '这是一段中文测试内容用来测试阅读时间';
    const result = calculateReadingTime(content, {locale: 'zh'});
    expect(result.words).toBeGreaterThan(0);
    expect(result.text).toContain('分钟阅读');
  });

  it('should handle mixed CJK and Latin content', () => {
    const content = 'Hello 世界 this is a test 测试';
    const result = calculateReadingTime(content);
    expect(result.words).toBeGreaterThan(5);
  });

  it('should respect custom words per minute', () => {
    const words = Array(100).fill('word').join(' ');
    const fast = calculateReadingTime(words, {wordsPerMinute: 400});
    const slow = calculateReadingTime(words, {wordsPerMinute: 100});
    expect(fast.minutes).toBeLessThan(slow.minutes);
  });

  it('should count images and add reading time', () => {
    const content =
      'Some text ![alt](image1.png) more text ![alt](image2.png)';
    const withImages = calculateReadingTime(content, {includeImages: true});
    const withoutImages = calculateReadingTime(content, {
      includeImages: false,
    });
    expect(withImages.minutes).toBeGreaterThan(withoutImages.minutes);
  });

  it('should handle HTML img tags for image counting', () => {
    const content = 'Text <img src="test.png" alt="test"> more text';
    const result = calculateReadingTime(content, {includeImages: true});
    expect(result.minutes).toBeGreaterThan(0);
  });

  it('should return at least 1 min read for non-empty content', () => {
    const result = calculateReadingTime('Just a few words.');
    expect(result.text).toBe('1 min read');
  });

  it('should handle CJK locale formatting', () => {
    const words = Array(500).fill('word').join(' ');
    const result = calculateReadingTime(words, {locale: 'zh-CN'});
    expect(result.text).toContain('分钟阅读');
  });

  it('should handle ja locale as CJK', () => {
    const content = 'テストコンテンツ';
    const result = calculateReadingTime(content, {locale: 'ja'});
    expect(result.text).toContain('分钟阅读');
  });

  it('should handle ko locale as CJK', () => {
    const content = '테스트 콘텐츠';
    const result = calculateReadingTime(content, {locale: 'ko'});
    expect(result.text).toContain('분钟阅读');
  });
});
