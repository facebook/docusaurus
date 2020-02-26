/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Prism from 'prism-react-renderer/prism';

import siteConfig from '@generated/docusaurus.config';

const {
  themeConfig: {prism: {additionalLanguages = []} = {}},
} = siteConfig;

window.Prism = Prism;

additionalLanguages.forEach(lang => {
  require(`prismjs/components/prism-${lang}`); // eslint-disable-line
});

delete window.Prism;
