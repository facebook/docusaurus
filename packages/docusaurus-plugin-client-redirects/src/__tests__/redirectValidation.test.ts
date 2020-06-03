/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateRedirect} from '../redirectValidation';

describe('validateRedirect', () => {
  test('validate good redirects without throwing', () => {
    validateRedirect({
      fromRoutePath: '/fromSomePath',
      toRoutePath: '/toSomePath',
    });
    validateRedirect({
      fromRoutePath: '/from/Some/Path',
      toRoutePath: '/toSomePath',
    });
    validateRedirect({
      fromRoutePath: '/fromSomePath',
      toRoutePath: '/toSomePath',
    });
    validateRedirect({
      fromRoutePath: '/fromSomePath',
      toRoutePath: '/to/Some/Path',
    });
  });

  test('throw for bad redirects', () => {
    expect(() =>
      validateRedirect({
        fromRoutePath: 'https://fb.com/fromSomePath',
        toRoutePath: '/toSomePath',
      }),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      validateRedirect({
        fromRoutePath: '/fromSomePath',
        toRoutePath: 'https://fb.com/toSomePath',
      }),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      validateRedirect({
        fromRoutePath: '/fromSomePath',
        toRoutePath: '/toSomePath?queryString=xyz',
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
