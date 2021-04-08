/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function createExcerpt(fileString: string): string | undefined {
  const fileLines = fileString.trimLeft().split('\n');

  /* eslint-disable no-continue */
  // eslint-disable-next-line no-restricted-syntax
  for (const fileLine of fileLines) {
    // Skip empty line.
    if (!fileLine.trim()) {
      continue;
    }

    // Skip import/export declaration.
    if (/^\s*?import\s.*(from.*)?;?|export\s.*{.*};?/.test(fileLine)) {
      continue;
    }

    const cleanedLine = fileLine
      // Remove HTML tags.
      .replace(/<[^>]*>/g, '')
      // Remove ATX-style headers.
      .replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
      // Remove emphasis and strikethroughs.
      .replace(/([\*_~]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove images.
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove footnotes.
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      // Remove inline links.
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove inline code.
      .replace(/`(.+?)`/g, '$1')
      // Remove blockquotes.
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove admonition definition.
      .replace(/(:{3}.*)/, '')
      // Remove Emoji names within colons include preceding whitespace.
      .replace(/\s?(:(::|[^:\n])+:)/g, '')
      .trim();

    if (cleanedLine) {
      return cleanedLine;
    }
  }

  return undefined;
}
