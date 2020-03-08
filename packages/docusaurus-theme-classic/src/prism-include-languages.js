/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Prism from 'prism-react-renderer/prism';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

(() => {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: {prism: {additionalLanguages = []} = {}},
    } = siteConfig;

    window.Prism = Prism;

    additionalLanguages.forEach(lang => {
      require(`prismjs/components/prism-${lang}`); // eslint-disable-line
    });

    delete window.Prism;
  }
})();
