/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TitleFormatterFnDefault} from '../titleFormatterUtils';

describe('TitleFormatterFnDefault', () => {
  it('works', () => {
    expect(
      TitleFormatterFnDefault({
        title: 'a page',
        siteTitle: 'my site',
        titleDelimiter: '·',
      }),
    ).toBe('a page · my site');
  });

  it('ignores empty title', () => {
    expect(
      TitleFormatterFnDefault({
        title: '    ',
        siteTitle: 'my site',
        titleDelimiter: '·',
      }),
    ).toBe('my site');
  });

  it('does not duplicate site title', () => {
    // Users may pass <Layout title={siteTitle}> leading to duplicate titles
    // By default it's preferable to avoid duplicate siteTitle
    // See also https://github.com/facebook/docusaurus/issues/5878#issuecomment-961505856
    expect(
      TitleFormatterFnDefault({
        title: 'my site',
        siteTitle: 'my site',
        titleDelimiter: '·',
      }),
    ).toBe('my site');
  });
});
