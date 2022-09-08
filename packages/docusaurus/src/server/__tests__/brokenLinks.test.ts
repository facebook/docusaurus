/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import _ from 'lodash';
import {handleBrokenLinks} from '../brokenLinks';
import type {RouteConfig} from '@docusaurus/types';

describe('handleBrokenLinks', () => {
  const routes: RouteConfig[] = [
    {
      path: '/community',
      component: '',
    },
    {
      path: '/docs',
      component: '',
      routes: [
        {path: '/docs/goodDoc', component: ''},
        {path: '/docs/anotherGoodDoc', component: ''},
        {path: '/docs/good doc with space', component: ''},
        {path: '/docs/another good doc with space', component: ''},
        {path: '/docs/weird%20but%20good', component: ''},
      ],
    },
    {
      path: '*',
      component: '',
    },
  ];

  const link1 = '/link1';
  const link2 = '/docs/link2';
  const link3 = '/hey/link3';

  const linkToJavadoc1 = '/javadoc';
  const linkToJavadoc2 = '/javadoc/';
  const linkToJavadoc3 = '/javadoc/index.html';
  const linkToJavadoc4 = '/javadoc/index.html#foo';

  const linkToZipFile = '/files/file.zip';
  const linkToHtmlFile1 = '/files/hey.html';
  const linkToHtmlFile2 = '/files/hey';

  const linkToEmptyFolder1 = '/emptyFolder';
  const linkToEmptyFolder2 = '/emptyFolder/';
  const allCollectedLinks = {
    '/docs/good doc with space': [
      // Good - valid file with spaces in name
      './another%20good%20doc%20with%20space',
      // Good - valid file with percent-20 in its name
      './weird%20but%20good',
      // Bad - non-existent file with spaces in name
      './some%20other%20non-existent%20doc1',
      // Evil - trying to use ../../ but '/' won't get decoded
      // cSpell:ignore Fout
      './break%2F..%2F..%2Fout2',
    ],
    '/docs/goodDoc': [
      // Good links
      './anotherGoodDoc#someHash',
      '/docs/anotherGoodDoc?someQueryString=true#someHash',
      '../docs/anotherGoodDoc?someQueryString=true',
      '../docs/anotherGoodDoc#someHash',
      // Bad links
      '../anotherGoodDoc#reported-because-of-bad-relative-path1',
      './docThatDoesNotExist2',
      './badRelativeLink3',
      '../badRelativeLink4',
    ],
    '/community': [
      // Good links
      '/docs/goodDoc',
      '/docs/anotherGoodDoc#someHash',
      './docs/goodDoc#someHash',
      './docs/anotherGoodDoc',
      // Bad links
      '/someNonExistentDoc1',
      '/badLink2',
      './badLink3',
    ],
    '/page1': [
      link1,
      linkToHtmlFile1,
      linkToJavadoc1,
      linkToHtmlFile2,
      linkToJavadoc3,
      linkToJavadoc4,
      linkToEmptyFolder1, // Not filtered!
    ],
    '/page2': [
      link2,
      linkToEmptyFolder2, // Not filtered!
      linkToJavadoc2,
      link3,
      linkToJavadoc3,
      linkToZipFile,
    ],
  };

  const outDir = path.resolve(__dirname, '__fixtures__/brokenLinks/outDir');

  it('do not report anything for correct paths', async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const allCollectedCorrectLinks = {
      '/docs/good doc with space': [
        './another%20good%20doc%20with%20space',
        './weird%20but%20good',
      ],
      '/docs/goodDoc': [
        './anotherGoodDoc#someHash',
        '/docs/anotherGoodDoc?someQueryString=true#someHash',
        '../docs/anotherGoodDoc?someQueryString=true',
        '../docs/anotherGoodDoc#someHash',
      ],
      '/community': [
        '/docs/goodDoc',
        '/docs/anotherGoodDoc#someHash',
        './docs/goodDoc#someHash',
        './docs/anotherGoodDoc',
      ],
      '/page1': [
        linkToHtmlFile1,
        linkToJavadoc1,
        linkToHtmlFile2,
        linkToJavadoc3,
        linkToJavadoc4,
      ],
    };
    await handleBrokenLinks({
      allCollectedLinks: allCollectedCorrectLinks,
      onBrokenLinks: 'warn',
      routes,
      baseUrl: '/',
      outDir,
    });
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });

  it('reports all broken links', async () => {
    await expect(() =>
      handleBrokenLinks({
        allCollectedLinks,
        onBrokenLinks: 'throw',
        routes,
        baseUrl: '/',
        outDir,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('no-op for ignore', async () => {
    // In any case, _.mapValues will always be called, unless handleBrokenLinks
    // has already bailed
    const lodashMock = jest.spyOn(_, 'mapValues');
    await handleBrokenLinks({
      allCollectedLinks,
      onBrokenLinks: 'ignore',
      routes,
      baseUrl: '/',
      outDir,
    });
    expect(lodashMock).toHaveBeenCalledTimes(0);
    lodashMock.mockRestore();
  });

  it('reports frequent broken links', async () => {
    Object.values(allCollectedLinks).forEach((links) =>
      links.push(
        '/frequent',
        // This is in the gray area of what should be reported. Relative paths
        // may be resolved to different slugs on different locations. But if
        // this comes from a layout link, it should be reported anyways
        './maybe-not',
      ),
    );

    await expect(() =>
      handleBrokenLinks({
        allCollectedLinks,
        onBrokenLinks: 'throw',
        routes,
        baseUrl: '/',
        outDir,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
