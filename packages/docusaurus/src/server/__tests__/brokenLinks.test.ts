/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getBrokenLinksErrorMessage, getAllBrokenLinks} from '../brokenLinks';
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
});
