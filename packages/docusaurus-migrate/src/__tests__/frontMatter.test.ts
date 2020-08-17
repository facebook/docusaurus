/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {shouldQuotifyFrontMatter} from '../frontMatter';

describe('frontMatter', () => {
  test('shouldQuotifyFrontMatter', () => {
    expect(shouldQuotifyFrontMatter(['id', 'value'])).toEqual(false);
    expect(
      shouldQuotifyFrontMatter([
        'title',
        "Some title front matter with allowed special chars like sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ!;,=+-_?'`&#()[]§%€$",
      ]),
    ).toEqual(false);

    expect(shouldQuotifyFrontMatter(['title', 'Special char :'])).toEqual(true);

    expect(shouldQuotifyFrontMatter(['title', 'value!'])).toEqual(false);
    expect(shouldQuotifyFrontMatter(['title', '!value'])).toEqual(true);

    expect(shouldQuotifyFrontMatter(['tags', '[tag1, tag2]'])).toEqual(false);
  });
});
