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
      anchors: [],
    },
    '/community': {
      links: [
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
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
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
          '#someHash',
          '/community#anchorFromGoodDoc',
          './anotherGoodDoc#someHash',
          '/docs/anotherGoodDoc?someQueryString=true#someHash',
          '../docs/anotherGoodDoc?someQueryString=true',
          '../docs/anotherGoodDoc#someHash',
        ],
        anchors: ['someHash'], // anchors here are anchors of the page itself (/docs/goodDoc) not the links in it
      },
      '/community': {
        links: [
          '/docs/goodDoc',
          '/docs/anotherGoodDoc#someHash', // anchor here is an anchor of an other page, it should be checked against the anchors of the other page
          './docs/goodDoc#someHash',
          './docs/anotherGoodDoc',
        ],
        anchors: ['anchorFromGoodDoc'],
      },
    };
    await handleBrokenLinks({
      allCollectedLinks: allCollectedCorrectLinks,
      onBrokenLinks: 'warn',
      onBrokenAnchors: 'warn',
      routes,
    });
    expect(consoleMock).toHaveBeenCalledTimes(0);
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
