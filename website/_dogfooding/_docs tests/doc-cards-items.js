/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import png from '@site/static/img/docusaurus.png';

const items = [
  {
    label: 'Custom Icon',
    description: 'Custom Icon',
    href: '/docs/tutorials',
    icon: '📖',
    type: 'link',
  },
  {
    label: 'Custom Icon',
    description: 'Custom Icon',
    href: '/docs/talks',
    icon: '🖥',
    type: 'link',
  },
  {
    label: 'Custom Icon (external link)',
    description: 'Custom Icon (external link)',
    href: 'https://external-site.com/workshops',
    icon: '🛠',
    type: 'link',
  },
  {
    label: 'Default Icon (internal link)',
    description: 'Default Icon (internal link)',
    href: '/docs/tutorials',
    type: 'link',
  },
  {
    label: 'Default Icon (internal link)',
    description: 'Default Icon (internal link)',
    href: '/docs/talks',
    type: 'link',
  },
  {
    label: 'Default Icon (external link)',
    description: 'Default Icon (external link)',
    href: 'https://external-site.com/workshops',
    type: 'link',
  },
  {
    label: 'Custom Image',
    description: 'Test with custom image',
    href: 'https://docusaurus.io',
    icon: png,
    type: 'link',
  },
];

export default items;
