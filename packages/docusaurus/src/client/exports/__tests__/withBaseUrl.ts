/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import withBaseUrl from '../withBaseUrl';
import useDocusaurusContext from '../useDocusaurusContext';
jest.mock('../useDocusaurusContext', () => jest.fn(), {virtual: true});

const mockedContext = <jest.Mock>useDocusaurusContext;

describe('withBaseUrl', () => {
  test('empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/',
      },
    }));

    expect(withBaseUrl('hello')).toEqual('/hello');
    expect(withBaseUrl('/hello')).toEqual('/hello');
    expect(withBaseUrl('hello/')).toEqual('/hello/');
    expect(withBaseUrl('/hello/')).toEqual('/hello/');
    expect(withBaseUrl('hello/byebye')).toEqual('/hello/byebye');
    expect(withBaseUrl('/hello/byebye')).toEqual('/hello/byebye');
    expect(withBaseUrl('hello/byebye/')).toEqual('/hello/byebye/');
    expect(withBaseUrl('/hello/byebye/')).toEqual('/hello/byebye/');
    expect(withBaseUrl('https://github.com')).toEqual('https://github.com');
    expect(withBaseUrl('//reactjs.org')).toEqual('//reactjs.org');
  });

  test('non-empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/docusaurus/',
      },
    }));

    expect(withBaseUrl('hello')).toEqual('/docusaurus/hello');
    expect(withBaseUrl('/hello')).toEqual('/docusaurus/hello');
    expect(withBaseUrl('hello/')).toEqual('/docusaurus/hello/');
    expect(withBaseUrl('/hello/')).toEqual('/docusaurus/hello/');
    expect(withBaseUrl('hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(withBaseUrl('/hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(withBaseUrl('hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
    expect(withBaseUrl('/hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
    expect(withBaseUrl('https://github.com')).toEqual('https://github.com');
    expect(withBaseUrl('//reactjs.org')).toEqual('//reactjs.org');
  });
});
