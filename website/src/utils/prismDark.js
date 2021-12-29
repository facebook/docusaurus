/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const darkTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
  ...darkTheme,
  styles: [
    ...darkTheme.styles,
    {
      types: ['title'],
      style: {
        color: '#BD93F9',
        fontWeight: 'bold',
      },
    },
    {
      types: ['operator', 'unit'],
      style: {
        color: '#FF79C6',
      },
    },
    {
      types: ['keyword', 'property-access'],
      style: {
        color: '#50FA7B',
      },
    },
    {
      types: ['boolean', 'number', 'color'],
      style: {
        color: '#BD93F9',
      },
    },
    {
      types: ['atrule'],
      style: {
        color: '#8BE9FD',
      },
    },
    {
      types: ['keyword'],
      style: {
        color: '#FF79C6',
        fontStyle: 'normal',
      },
    },
    {
      types: ['string', 'font-matter'],
      style: {
        color: '#F1FA8C',
      },
    },
    {
      types: ['property'],
      style: {
        color: '#8BE9FD',
      },
    },
    {
      types: ['parameter'],
      style: {
        color: '#FFB86C',
        fontStyle: 'italic',
      },
    },
    {
      types: ['attr-name', 'selector'],
      style: {
        color: '#50FA7B',
        fontStyle: 'italic',
      },
    },
  ],
};
