/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'level 1',
      items: [
        'a',
        {
          type: 'category',
          label: 'level 2',
          items: [
            {
              type: 'category',
              label: 'level 3',
              items: [
                'c',
                {
                  type: 'category',
                  label: 'level 4',
                  items: [
                    'd',
                    {
                      type: 'category',
                      label: 'deeper more more',
                      items: ['e'],
                    },
                  ],
                },
              ],
            },
            'f',
          ],
        },
      ],
    },
  ],
};
