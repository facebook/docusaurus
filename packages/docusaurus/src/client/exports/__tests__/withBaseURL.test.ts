/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('withBaseURL', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('empty base URL', () => {
    jest.doMock(
      '@generated/docusaurus.config',
      () => {
        return {baseUrl: '/'};
      },
      {virtual: true},
    );

    const withBaseURL = require('../withBaseURL').default;
    expect(withBaseURL('hello')).toEqual('/hello');
    expect(withBaseURL('/hello')).toEqual('/hello');
    expect(withBaseURL('hello/')).toEqual('/hello/');
    expect(withBaseURL('/hello/')).toEqual('/hello/');
    expect(withBaseURL('hello/byebye')).toEqual('/hello/byebye');
    expect(withBaseURL('/hello/byebye')).toEqual('/hello/byebye');
    expect(withBaseURL('hello/byebye/')).toEqual('/hello/byebye/');
    expect(withBaseURL('/hello/byebye/')).toEqual('/hello/byebye/');
  });

  test('non-empty base URL', () => {
    jest.doMock(
      '@generated/docusaurus.config',
      () => {
        return {baseUrl: '/docusaurus/'};
      },
      {virtual: true},
    );

    const withBaseURL = require('../withBaseURL').default;
    expect(withBaseURL('hello')).toEqual('/docusaurus/hello');
    expect(withBaseURL('/hello')).toEqual('/docusaurus/hello');
    expect(withBaseURL('hello/')).toEqual('/docusaurus/hello/');
    expect(withBaseURL('/hello/')).toEqual('/docusaurus/hello/');
    expect(withBaseURL('hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(withBaseURL('/hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(withBaseURL('hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
    expect(withBaseURL('/hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
  });
});
