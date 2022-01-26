/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFileLoaderUtils} from '../webpackUtils';

describe('getFileLoaderUtils()', () => {
  test('plugin svgo/removeViewBox should be disabled', () => {
    const {oneOf} = getFileLoaderUtils().rules.svg();
    expect(oneOf[0].use).toContainEqual(
      expect.objectContaining({
        loader: require.resolve('@svgr/webpack'),
        options: expect.objectContaining({
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        }),
      }),
    );
  });
});
