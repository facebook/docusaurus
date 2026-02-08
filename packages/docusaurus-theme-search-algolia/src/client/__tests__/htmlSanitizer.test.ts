/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {sanitizeHtml, sanitizeAlgoliaHtml} from '../htmlSanitizer';

describe('sanitizeHtml', () => {
  it('preserves safe formatting tags', () => {
    expect(sanitizeHtml('<em>highlighted</em>')).toBe('<em>highlighted</em>');
    expect(sanitizeHtml('<mark>marked</mark>')).toBe('<mark>marked</mark>');
    expect(sanitizeHtml('<strong>strong</strong>')).toBe(
      '<strong>strong</strong>',
    );
    expect(sanitizeHtml('<b>bold</b>')).toBe('<b>bold</b>');
    expect(sanitizeHtml('<i>italic</i>')).toBe('<i>italic</i>');
  });

  it('preserves allowed class attributes', () => {
    expect(sanitizeHtml('<em class="highlight">text</em>')).toBe(
      '<em class="highlight">text</em>',
    );
  });

  it('strips dangerous tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).toBe('');
    expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('');
    expect(sanitizeHtml('<object data="evil.swf"></object>')).toBe('');
    expect(sanitizeHtml('<embed src="evil.swf">')).toBe('');
  });

  it('strips dangerous attributes', () => {
    expect(sanitizeHtml('<em onclick="alert(1)">text</em>')).toBe(
      '<em>text</em>',
    );
    expect(sanitizeHtml('<em onload="alert(1)">text</em>')).toBe(
      '<em>text</em>',
    );
    expect(sanitizeHtml('<em style="color:red">text</em>')).toBe(
      '<em>text</em>',
    );
  });

  it('escapes HTML entities in text content', () => {
    // Already-escaped entities are preserved as-is (not double-escaped)
    expect(sanitizeHtml('&lt;script&gt;')).toBe('&lt;script&gt;');
    expect(sanitizeHtml('<em>&lt;test&gt;</em>')).toBe('<em>&lt;test&gt;</em>');
  });

  it('handles nested tags correctly', () => {
    expect(sanitizeHtml('<em><strong>nested</strong></em>')).toBe(
      '<em><strong>nested</strong></em>',
    );
    expect(sanitizeHtml('<em><script>evil</script>safe</em>')).toBe(
      '<em>safe</em>',
    );
  });

  it('handles mixed content', () => {
    expect(sanitizeHtml('text <em>highlighted</em> more text')).toBe(
      'text <em>highlighted</em> more text',
    );
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('handles malformed HTML gracefully', () => {
    // Regex-based sanitizer doesn't auto-close tags (acceptable trade-off)
    expect(sanitizeHtml('<em>unclosed')).toBe('<em>unclosed');
    // Unopened closing tags are kept (harmless in HTML)
    expect(sanitizeHtml('unopened</em>')).toBe('unopened</em>');
  });

  it('prevents javascript: protocol in attributes', () => {
    // Even though href is not allowed, test that it would be stripped
    expect(sanitizeHtml('<a href="javascript:alert(1)">link</a>')).toBe('link');
  });

  it('prevents data: protocol attacks', () => {
    expect(
      sanitizeHtml('<img src="data:text/html,<script>alert(1)</script>">'),
    ).toBe('');
  });
});

describe('sanitizeAlgoliaHtml', () => {
  it('replaces Algolia CSS classes', () => {
    expect(
      sanitizeAlgoliaHtml(
        '<em class="algolia-docsearch-suggestion--highlight">text</em>',
      ),
    ).toBe('<em class="search-result-match">text</em>');
  });

  it('sanitizes and replaces classes together', () => {
    expect(
      sanitizeAlgoliaHtml(
        '<em class="algolia-docsearch-suggestion--highlight">safe</em><script>evil</script>',
      ),
    ).toBe('<em class="search-result-match">safe</em>');
  });

  it('handles typical Algolia search result format', () => {
    const algoliaResult =
      'This is a <em class="algolia-docsearch-suggestion--highlight">search</em> result';
    expect(sanitizeAlgoliaHtml(algoliaResult)).toBe(
      'This is a <em class="search-result-match">search</em> result',
    );
  });
});
