/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {shouldQuotifyFrontMatter} from '../frontMatter';

describe('shouldQuotifyFrontMatter', () => {
  it('works', () => {
    expect(shouldQuotifyFrontMatter(['id', 'value'])).toBe(false);
    expect(
      shouldQuotifyFrontMatter([
        'title',
        // cSpell:ignore sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ
        "Some title front matter with allowed special chars like sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ!;,=+-_?'`&#()[]§%€$",
      ]),
    ).toBe(false);

    expect(shouldQuotifyFrontMatter(['title', 'Special char :'])).toBe(true);

    expect(shouldQuotifyFrontMatter(['title', 'value!'])).toBe(false);
    expect(shouldQuotifyFrontMatter(['title', '!value'])).toBe(true);

    expect(shouldQuotifyFrontMatter(['tags', '[tag1, tag2]'])).toBe(false);
  });
});
