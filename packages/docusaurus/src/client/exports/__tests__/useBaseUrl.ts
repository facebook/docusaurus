/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useBaseUrl from '../useBaseUrl';
import useDocusaurusContext from '../useDocusaurusContext';

jest.mock('../useDocusaurusContext', () => jest.fn(), {virtual: true});

const mockedContext = useDocusaurusContext as jest.Mock;

describe('useBaseUrl', () => {
  test('empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/',
      },
    }));

    expect(useBaseUrl('hello')).toEqual('/hello');
    expect(useBaseUrl('/hello')).toEqual('/hello');
    expect(useBaseUrl('hello/')).toEqual('/hello/');
    expect(useBaseUrl('/hello/')).toEqual('/hello/');
    expect(useBaseUrl('hello/byebye')).toEqual('/hello/byebye');
    expect(useBaseUrl('/hello/byebye')).toEqual('/hello/byebye');
    expect(useBaseUrl('hello/byebye/')).toEqual('/hello/byebye/');
    expect(useBaseUrl('/hello/byebye/')).toEqual('/hello/byebye/');
    expect(useBaseUrl('https://github.com')).toEqual('https://github.com');
    expect(useBaseUrl('//reactjs.org')).toEqual('//reactjs.org');
  });

  test('non-empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/docusaurus/',
      },
    }));

    expect(useBaseUrl('hello')).toEqual('/docusaurus/hello');
    expect(useBaseUrl('/hello')).toEqual('/docusaurus/hello');
    expect(useBaseUrl('hello/')).toEqual('/docusaurus/hello/');
    expect(useBaseUrl('/hello/')).toEqual('/docusaurus/hello/');
    expect(useBaseUrl('hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(useBaseUrl('/hello/byebye')).toEqual('/docusaurus/hello/byebye');
    expect(useBaseUrl('hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
    expect(useBaseUrl('/hello/byebye/')).toEqual('/docusaurus/hello/byebye/');
    expect(useBaseUrl('https://github.com')).toEqual('https://github.com');
    expect(useBaseUrl('//reactjs.org')).toEqual('//reactjs.org');
  });
});
