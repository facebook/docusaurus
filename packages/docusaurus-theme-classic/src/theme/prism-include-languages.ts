/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';

const prismIncludeLanguages = (PrismObject: typeof PrismNamespace): void => {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: {prism: {additionalLanguages = []} = {}},
    } = siteConfig;

    window.Prism = PrismObject;

    additionalLanguages.forEach((lang: string) => {
      require(`prismjs/components/prism-${lang}`); // eslint-disable-line
    });

    delete (window as Window & {Prism?: typeof PrismNamespace}).Prism;
  }
};

export default prismIncludeLanguages;
