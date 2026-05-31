/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {extractLeadingEmoji} from '../emojiUtils';

describe('extractLeadingEmoji', () => {
  it('extracts simple leading emoji', () => {
    expect(extractLeadingEmoji('😀 Hello World')).toEqual({
      emoji: '😀',
      rest: ' Hello World',
    });
  });

  it('extracts only the first emoji', () => {
    expect(extractLeadingEmoji('😀😀 Hello World')).toEqual({
      emoji: '😀',
      rest: '😀 Hello World',
    });
  });

  it('extracts emoji with multiple code points - 🇫🇷', () => {
    expect(extractLeadingEmoji('🇫🇷 Hello World')).toEqual({
      emoji: '🇫🇷',
      rest: ' Hello World',
    });
  });

  it('extracts emoji with multiple code points - 👨‍👩‍👧‍👦', () => {
    expect(extractLeadingEmoji('👨‍👩‍👧‍👦 Hello World')).toEqual({
      emoji: '👨‍👩‍👧‍👦',
      rest: ' Hello World',
    });
  });

  it('extracts leading keycap emoji', () => {
    expect(extractLeadingEmoji('1️⃣ First item')).toEqual({
      emoji: '1️⃣',
      rest: ' First item',
    });
  });

  it('preserves original string', () => {
    expect(extractLeadingEmoji('Hello World')).toEqual({
      emoji: null,
      rest: 'Hello World',
    });
  });

  it('preserves original string - leading digit', () => {
    expect(extractLeadingEmoji('11 Something')).toEqual({
      emoji: null,
      rest: '11 Something',
    });
  });

  it('preserves original string - leading emoji after space', () => {
    expect(extractLeadingEmoji(' 😀 Hello World')).toEqual({
      emoji: null,
      rest: ' 😀 Hello World',
    });
  });

  it('preserves original string - middle emoji', () => {
    expect(extractLeadingEmoji('Hello 😀 World')).toEqual({
      emoji: null,
      rest: 'Hello 😀 World',
    });
  });

  it('preserves original string - trailing emoji', () => {
    expect(extractLeadingEmoji('Hello World 😀')).toEqual({
      emoji: null,
      rest: 'Hello World 😀',
    });
  });
});
