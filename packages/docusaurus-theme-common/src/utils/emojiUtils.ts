/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const segmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'});

/**
 * This method splits "⚠️ Hello World" into "⚠️" + " Hello World".
 * It is quite strict and dumb, only useful to handle best-effort heuristics.
 * It only extracts a leading emoji if it is the first grapheme of the string.
 * It only extracts one emoji, even if multiples are present.
 * It doesn't trim the remaining string.
 * If you need something more clever, it should be built on top.
 * @param input
 */
export function extractLeadingEmoji(input: string): {
  emoji: string | null;
  rest: string;
} {
  const it = segmenter.segment(input)[Symbol.iterator]();

  // const first = segmenter.segment(input).containing(0)?.segment;
  const grapheme = it.next().value?.segment;

  if (!grapheme) {
    return {emoji: null, rest: input};
  }

  // Distinguish single-codepoint from multi-codepoint graphemes.
  //
  // Single-codepoint graphemes: many non-emoji symbols like ©, ®, ™, ♠, ♥,
  // #, *, and ASCII digits match /\p{Emoji}/u because Unicode classifies
  // them as Emoji Keycap Base or text-default emoji.  Using
  // /\p{Emoji_Presentation}/u instead correctly rejects them — it only
  // matches characters whose default presentation is emoji (e.g. 😀, 🎉).
  //
  // Multi-codepoint graphemes (length > 1): real keycap emoji (digit +
  // U+FE0F + U+20E3), VS16 sequences (⚠ + U+FE0F → ⚠️), flags, and ZWJ
  // compositions.  These are unambiguous emoji and should be detected via
  // the broader /\p{Extended_Pictographic}/u || /\p{Emoji}/u check.
  if ([...grapheme].length === 1) {
    // Single codepoint — only emoji-presentation chars qualify
    if (/\p{Emoji_Presentation}/u.test(grapheme)) {
      return {emoji: grapheme, rest: input.slice(grapheme.length)};
    }
    return {emoji: null, rest: input};
  }

  // Multi-codepoint grapheme — accept if it contains an emoji property
  // (covers keycaps, VS16 combos, flags, ZWJ, skin tones)
  if (
    !/\p{Extended_Pictographic}/u.test(grapheme) &&
    !/\p{Emoji}/u.test(grapheme)
  ) {
    return {emoji: null, rest: input};
  }

  return {emoji: grapheme, rest: input.slice(grapheme.length)};
}
