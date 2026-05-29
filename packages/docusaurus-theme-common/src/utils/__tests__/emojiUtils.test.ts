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

  it('preserves original string', () => {
    expect(extractLeadingEmoji('Hello World')).toEqual({
      emoji: null,
      rest: 'Hello World',
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
