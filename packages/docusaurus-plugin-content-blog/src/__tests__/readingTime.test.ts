/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import readingTime from 'reading-time';
import {defaultReadingTime} from '../blogUtils';
import {calculateReadingTime} from '../readingTime';

describe('readingTime implementation', () => {
  it('calculates reading time for simple text', () => {
    const content = 'This is a simple test with 7 words.';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for empty content', () => {
    const content = '';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: 0,
      time: 0,
      words: 0,
    });
  });

  it('calculates reading time for content with emojis', () => {
    const content = 'Hello 😊 World 🌍';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with special characters', () => {
    const content = 'Hello! How are you? This is a test...';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with multiple languages', () => {
    const content = 'Hello 你好 Bonjour';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with HTML tags', () => {
    const content = '<p>This is a <strong>test</strong> with HTML</p>';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with code blocks', () => {
    const content = '```js\nconst x = 1;\n```\nThis is a test';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with frontmatter', () => {
    const content = '---\ntitle: Test\n---\nThis is a test';
    const result = readingTime(content);
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time for content with custom options', () => {
    const content = 'This is a test';
    const result = readingTime(content, {wordsPerMinute: 100});
    expect(result).toMatchObject({
      text: expect.any(String),
      minutes: expect.any(Number),
      time: expect.any(Number),
      words: expect.any(Number),
    });
  });

  it('calculates reading time using defaultReadingTime', () => {
    const content = 'This is a test';
    const result = defaultReadingTime({content, options: {}});
    expect(result).toBeGreaterThan(0);
  });

  describe('Intl.Segmenter implementation', () => {
    it('calculates reading time for simple text', () => {
      const content = 'This is a simple test with 7 words.';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 7,
      });
    });

    it('calculates reading time for empty content', () => {
      const content = '';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: '0 min read',
        minutes: 0,
        time: 0,
        words: 0,
      });
    });

    it('calculates reading time for content with emojis', () => {
      const content = 'Hello 😊 World 🌍';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 2,
      });
    });

    it('calculates reading time for content with special characters', () => {
      const content = 'Hello! How are you? This is a test...';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 7,
      });
    });

    it('calculates reading time for content with multiple languages', () => {
      const content = 'Hello 你好 Bonjour';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 3,
      });
    });

    it('calculates reading time for content with HTML tags', () => {
      const content = '<p>This is a <strong>test</strong> with HTML</p>';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 6,
      });
    });

    it('calculates reading time for content with code blocks', () => {
      const content = '```js\nconst x = 1;\n```\nThis is a test';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 4,
      });
    });

    it('calculates reading time for content with frontmatter', () => {
      const content = '---\ntitle: Test\n---\nThis is a test';
      const result = calculateReadingTime(content);
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 3,
      });
    });

    it('calculates reading time for content with custom options', () => {
      const content = 'This is a test';
      const result = calculateReadingTime(content, {wordsPerMinute: 100});
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 4,
      });
    });

    it('calculates reading time with different locale', () => {
      const content = 'Hello 你好 Bonjour';
      const result = calculateReadingTime(content, {locale: 'zh'});
      expect(result).toMatchObject({
        text: expect.any(String),
        minutes: expect.any(Number),
        time: expect.any(Number),
        words: 3,
      });
    });
  });
});
