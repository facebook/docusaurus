/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useBaseUrl, {useBaseUrlUtils} from '../useBaseUrl';
import useDocusaurusContext from '../useDocusaurusContext';

jest.mock('../useDocusaurusContext', () => jest.fn(), {virtual: true});

const mockedContext = <jest.Mock>useDocusaurusContext;

const forcePrepend = {forcePrependBaseUrl: true};

describe('useBaseUrl', () => {
  test('empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/',
        url: 'https://v2.docusaurus.io',
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
    expect(useBaseUrl('//reactjs.org', forcePrepend)).toEqual('//reactjs.org');
    expect(useBaseUrl('https://site.com', forcePrepend)).toEqual(
      'https://site.com',
    );
    expect(useBaseUrl('/hello/byebye', {absolute: true})).toEqual(
      'https://v2.docusaurus.io/hello/byebye',
    );
  });

  test('non-empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/docusaurus/',
        url: 'https://v2.docusaurus.io',
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
    expect(useBaseUrl('//reactjs.org', forcePrepend)).toEqual('//reactjs.org');
    expect(useBaseUrl('https://site.com', forcePrepend)).toEqual(
      'https://site.com',
    );
    expect(useBaseUrl('/hello/byebye', {absolute: true})).toEqual(
      'https://v2.docusaurus.io/docusaurus/hello/byebye',
    );
  });
});

describe('useBaseUrlUtils().withBaseUrl()', () => {
  test('empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/',
        url: 'https://v2.docusaurus.io',
      },
    }));
    const {withBaseUrl} = useBaseUrlUtils();

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
    expect(withBaseUrl('//reactjs.org', forcePrepend)).toEqual('//reactjs.org');
    expect(withBaseUrl('https://site.com', forcePrepend)).toEqual(
      'https://site.com',
    );
    expect(withBaseUrl('/hello/byebye', {absolute: true})).toEqual(
      'https://v2.docusaurus.io/hello/byebye',
    );
  });

  test('non-empty base URL', () => {
    mockedContext.mockImplementation(() => ({
      siteConfig: {
        baseUrl: '/docusaurus/',
        url: 'https://v2.docusaurus.io',
      },
    }));
    const {withBaseUrl} = useBaseUrlUtils();

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
    expect(withBaseUrl('//reactjs.org', forcePrepend)).toEqual('//reactjs.org');
    expect(withBaseUrl('https://site.com', forcePrepend)).toEqual(
      'https://site.com',
    );
    expect(withBaseUrl('/hello/byebye', {absolute: true})).toEqual(
      'https://v2.docusaurus.io/docusaurus/hello/byebye',
    );
  });
});
