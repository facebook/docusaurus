/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {RouteConfig} from '@docusaurus/types';
import {getAllFinalRoutes} from '../utils';

describe('getAllFinalRoutes', () => {
  test('should get final routes correctly', () => {
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
    ];
    expect(getAllFinalRoutes(routes)).toMatchSnapshot();
  });
});
