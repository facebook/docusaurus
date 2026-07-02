/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const baseUrlIssueBannerSource = readFileSync(
  new URL('../BaseUrlIssueBanner/index.tsx', import.meta.url),
  'utf8',
);

describe('BaseUrlIssueBanner', () => {
  it('renders the suggested baseUrl as text instead of HTML', () => {
    expect(baseUrlIssueBannerSource).toContain(
      'suggestionContainer.textContent = suggestedBaseUrl;',
    );
    expect(baseUrlIssueBannerSource).not.toContain(
      'suggestionContainer.innerHTML = suggestedBaseUrl;',
    );
  });
});
