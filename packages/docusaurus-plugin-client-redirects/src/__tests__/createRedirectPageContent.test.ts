/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createRedirectPageContent from '../createRedirectPageContent';

describe('createRedirectPageContent', () => {
  test('should match snapshot', () => {
    expect(
      createRedirectPageContent({toUrl: 'https://docusaurus.io/'}),
    ).toMatchSnapshot();
  });

  test('should encode uri special chars', () => {
    const result = createRedirectPageContent({
      toUrl: 'https://docusaurus.io/gr/σελιδας/',
    });
    expect(result).toContain(
      'https://docusaurus.io/gr/%CF%83%CE%B5%CE%BB%CE%B9%CE%B4%CE%B1%CF%82/',
    );
    expect(result).toMatchSnapshot();
  });
});
