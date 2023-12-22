/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import _ from 'lodash';
import {handleBrokenLinks} from '../brokenLinks';
import type {RouteConfig} from '@docusaurus/types';

type Params = Parameters<typeof handleBrokenLinks>[0];

// We don't need all the routes attributes for our tests
type SimpleRoute = {path: string; routes?: SimpleRoute[]};

// Conveniently apply defaults to function under test
async function testBrokenLinks(params: {
  allCollectedLinks?: Params['allCollectedLinks'];
  onBrokenLinks?: Params['onBrokenLinks'];
  onBrokenAnchors?: Params['onBrokenAnchors'];
  routes?: SimpleRoute[];
}) {
  await handleBrokenLinks({
    allCollectedLinks: {},
    onBrokenLinks: 'throw',
    onBrokenAnchors: 'throw',
    ...params,
    // Unsafe but convenient for tests
    routes: (params.routes ?? []) as RouteConfig[],
  });
}

describe('handleBrokenLinks NEW TESTS', () => {
  it('can accept simple valid link', async () => {
    await testBrokenLinks({
      routes: [{path: '/page1'}, {path: '/page2'}],
      allCollectedLinks: {
        '/page1': {links: ['/page2'], anchors: []},
      },
    });
  });

  it('can report simple broken link', async () => {
    await expect(() =>
      testBrokenLinks({
        allCollectedLinks: {
          '/pageWithBrokenLink': {links: ['/brokenLink'], anchors: []},
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus found broken links!

      Please check the pages of your site in the list below, and make sure you don't reference any path that does not exist.
      Note: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration, and let the build pass.

      Exhaustive list of all broken links found:
      - Broken link on source page path = /pageWithBrokenLink:
         -> linking to /brokenLink
      "
    `);
  });
});

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

  const allCollectedLinks = {
    '/docs/good doc with space': {
      links: [
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
      anchors: [],
    },
    '/docs/goodDoc': {
      links: [
        // Good links
        './anotherGoodDoc#anotherGoodDocHash',
        '/docs/anotherGoodDoc?someQueryString=true#anotherGoodDocHash',
        '../docs/anotherGoodDoc?someQueryString=true',
        '../docs/anotherGoodDoc#anotherGoodDocHash',
        // Bad links
        '../anotherGoodDoc#reported-because-of-bad-relative-path1',
        './docThatDoesNotExist2',
        './badRelativeLink3',
        '../badRelativeLink4',
      ],
      anchors: [],
    },
    '/community': {
      links: [
        // Good links
        '/docs/goodDoc',
        '/docs/anotherGoodDoc#anotherGoodDocHash',
        './docs/goodDoc#goodDocHash',
        './docs/anotherGoodDoc',
        // Bad links
        '/someNonExistentDoc1',
        '/badLink2',
        './badLink3',
      ],
      anchors: [],
    },
    '/page1': {
      links: [link1],
      anchors: [],
    },
    '/page2': {
      links: [link2, link3],
      anchors: [],
    },
  };

  it('do not report anything for correct paths', async () => {
    const allCollectedCorrectLinks = {
      '/docs/good doc with space': {
        links: [
          './another%20good%20doc%20with%20space',
          './weird%20but%20good',
        ],
        anchors: [],
      },
      '/docs/goodDoc': {
        links: [
          '#goodDocHash',
          '/community#communityAnchor',
          './anotherGoodDoc#nonExistingHash', // TODO should be reported!
          '/docs/anotherGoodDoc?someQueryString=true#anotherGoodDocHash',
          '../docs/anotherGoodDoc?someQueryString=true',
          '../docs/anotherGoodDoc#anotherGoodDocHash',
        ],
        anchors: ['goodDocHash'], // anchors here are anchors of the page itself (/docs/goodDoc) not the links in it
      },
      '/community': {
        links: [
          '/docs/goodDoc',
          '/docs/anotherGoodDoc#anotherGoodDocHash', // anchor here is an anchor of an other page, it should be checked against the anchors of the other page
          './docs/goodDoc#goodDocHash',
          './docs/anotherGoodDoc',
        ],
        anchors: ['communityAnchor'],
      },
    };

    await handleBrokenLinks({
      allCollectedLinks: allCollectedCorrectLinks,
      onBrokenLinks: 'throw',
      onBrokenAnchors: 'throw',
      routes,
    });
  });

  it('reports all broken links', async () => {
    await expect(() =>
      handleBrokenLinks({
        allCollectedLinks,
        onBrokenLinks: 'throw',
        onBrokenAnchors: 'throw',
        routes,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('no-op for ignore', async () => {
    // TODO this mock is not future-proof, we may remove mapValues
    // In any case, _.mapValues will always be called, unless handleBrokenLinks
    // has already bailed
    const lodashMock = jest.spyOn(_, 'mapValues');
    await handleBrokenLinks({
      allCollectedLinks,
      onBrokenLinks: 'ignore',
      onBrokenAnchors: 'ignore',
      routes,
    });
    expect(lodashMock).toHaveBeenCalledTimes(0);
    lodashMock.mockRestore();
  });

  it('reports frequent broken links', async () => {
    Object.values(allCollectedLinks).forEach(({links}) => {
      links.push(
        '/frequent',
        // This is in the gray area of what should be reported. Relative paths
        // may be resolved to different slugs on different locations. But if
        // this comes from a layout link, it should be reported anyways
        './maybe-not',
      );
    });

    await expect(() =>
      handleBrokenLinks({
        allCollectedLinks,
        onBrokenLinks: 'throw',
        onBrokenAnchors: 'throw',
        routes,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
