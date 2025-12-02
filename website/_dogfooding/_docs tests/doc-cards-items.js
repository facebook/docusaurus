/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import png from '@site/static/img/docusaurus.png';
import svgImg from '@site/static/img/docusaurus.svg';
import jpg from '@site/static/img/endi.jpg';

const items = [
  {
    label: 'Custom Icon',
    description: 'Custom Icon',
    href: '/docs/installation',
    icon: '📖',
    type: 'link',
  },
  {
    label: 'Custom Icon',
    description: 'Custom Icon',
    href: '/docs/configuration',
    icon: '🖥',
    type: 'link',
  },
  {
    label: 'Custom Icon (external link)',
    description: 'Custom Icon (external link)',
    href: 'https://react.dev/',
    icon: '🛠',
    type: 'link',
  },
  {
    label: 'Default Icon (internal link)',
    description: 'Default Icon (internal link)',
    href: '/docs/installation',
    type: 'link',
  },
  {
    label: 'Default Icon (internal link)',
    description: 'Default Icon (internal link)',
    href: '/docs/configuration',
    type: 'link',
  },
  {
    label: 'Default Icon (external link)',
    description: 'Default Icon (external link)',
    href: 'https://react.dev/',
    type: 'link',
  },
  {
    label: 'Custom Image',
    description: 'It works with PNG',
    href: 'https://react.dev/',
    icon: png,
    type: 'link',
  },
  {
    label: 'Custom Image',
    description: 'It works with JPG',
    href: 'https://react.dev/',
    icon: jpg,
    type: 'link',
  },
  {
    label: 'Custom Image',
    description: 'It does not work with SVG',
    href: 'https://react.dev/',
    icon: svgImg,
    type: 'link',
  },
];

export default items;
