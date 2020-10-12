/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  getBrokenLinksErrorMessage,
  getAllBrokenLinks,
  filterExistingFileLinks,
} from '../brokenLinks';
import {RouteConfig} from '@docusaurus/types';

describe('brokenLinks', () => {
  test('getBrokenLinksErrorMessage', async () => {
    const message = getBrokenLinksErrorMessage({
      '/docs/mySourcePage': [
        {link: './myBrokenLink', resolvedLink: '/docs/myBrokenLink'},
        {link: '../otherBrokenLink', resolvedLink: '/otherBrokenLink'},
      ],
      '/otherSourcePage': [{link: '/badLink', resolvedLink: '/badLink'}],
    });
    expect(message).toMatchSnapshot();
  });

  test('getBrokenLinksErrorMessage with potential layout broken links', async () => {
    const frequentLink = [
      {
        link: './myBrokenLinkFrequent1',
        resolvedLink: '/docs/myBrokenLinkFrequent1',
      },
      {
        link: './myBrokenLinkFrequent2',
        resolvedLink: '/docs/myBrokenLinkFrequent2',
      },
    ];
    const infrequentLink = [
      {
        link: './myBrokenLinkInfrequent1',
        resolvedLink: '/docs/myBrokenLinkInfrequent1',
      },
      {
        link: './myBrokenLinkInfrequent2',
        resolvedLink: '/docs/myBrokenLinkInfrequent2',
      },
    ];

    const message = getBrokenLinksErrorMessage({
      '/docs/page1': [...frequentLink],
      '/docs/page2': [...frequentLink, ...infrequentLink],
      '/docs/page3': [...frequentLink],
      '/docs/page4': [...frequentLink, ...infrequentLink],
      '/docs/page5': [...frequentLink],
      '/docs/page6': [...frequentLink],
    });
    expect(message).toMatchSnapshot();
  });

  test('getAllBrokenLinks', async () => {
    const routes: RouteConfig[] = [
      {
        path: '/docs',
        component: '',
        routes: [
          {path: '/docs/someDoc', component: ''},
          {path: '/docs/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/community',
        component: '',
      },
      {
        path: '*',
        component: '',
      },
    ];

    const allCollectedLinks = {
      '/docs/someDoc': [
        // Good links
        './someOtherDoc#someHash',
        '/docs/someOtherDoc?someQueryString=true#someHash',
        '../docs/someOtherDoc?someQueryString=true',
        '../docs/someOtherDoc#someHash',
        // Bad links
        '../someOtherDoc',
        './docThatDoesNotExist',
        './badRelativeLink',
        '../badRelativeLink',
      ],
      '/community': [
        // Good links
        '/docs/someDoc',
        '/docs/someOtherDoc#someHash',
        './docs/someDoc#someHash',
        './docs/someOtherDoc',
        // Bad links
        '/someOtherDoc',
        '/badLink',
        './badLink',
      ],
    };

    const expectedBrokenLinks = {
      '/docs/someDoc': [
        {
          link: '../someOtherDoc',
          resolvedLink: '/someOtherDoc',
        },
        {
          link: './docThatDoesNotExist',
          resolvedLink: '/docs/docThatDoesNotExist',
        },
        {
          link: './badRelativeLink',
          resolvedLink: '/docs/badRelativeLink',
        },
        {
          link: '../badRelativeLink',
          resolvedLink: '/badRelativeLink',
        },
      ],
      '/community': [
        {
          link: '/someOtherDoc',
          resolvedLink: '/someOtherDoc',
        },
        {
          link: '/badLink',
          resolvedLink: '/badLink',
        },
        {
          link: './badLink',
          resolvedLink: '/badLink',
        },
      ],
    };

    expect(getAllBrokenLinks({allCollectedLinks, routes})).toEqual(
      expectedBrokenLinks,
    );
  });

  test('filterExistingFileLinks', async () => {
    const link1 = '/link1';
    const link2 = '/docs/link2';
    const link3 = '/hey/link3';

    const linkToJavadoc1 = '/javadoc';
    const linkToJavadoc2 = '/javadoc/';
    const linkToJavadoc3 = '/javadoc/index.html';

    const linkToZipFile = '/files/file.zip';
    const linkToHtmlFile1 = '/files/hey.html';
    const linkToHtmlFile2 = '/files/hey';

    const linkToEmptyFolder1 = '/emptyFolder';
    const linkToEmptyFolder2 = '/emptyFolder/';

    const allCollectedLinks = {
      '/page1': [
        link1,
        linkToHtmlFile1,
        linkToJavadoc1,
        linkToHtmlFile2,
        linkToJavadoc3,
        linkToEmptyFolder1,
      ],
      '/page2': [
        link2,
        linkToEmptyFolder2,
        linkToJavadoc2,
        link3,
        linkToJavadoc3,
        linkToZipFile,
      ],
    };

    const allCollectedLinksFiltered = {
      '/page1': [
        link1,
        // linkToHtmlFile1,
        // linkToJavadoc1,
        // linkToHtmlFile2,
        // linkToJavadoc3,
        linkToEmptyFolder1, // not filtered !
      ],
      '/page2': [
        link2,
        linkToEmptyFolder2, // not filtered !
        // linkToJavadoc2,
        link3,
        // linkToJavadoc3,
        // linkToZipFile,
      ],
    };

    const result = await filterExistingFileLinks({
      baseUrl: '/',
      outDir: path.resolve(__dirname, '__fixtures__/brokenLinks/outDir'),
      allCollectedLinks,
    });
    expect(result).toEqual(allCollectedLinksFiltered);
  });
});
