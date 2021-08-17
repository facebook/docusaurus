/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import moduleAlias from 'module-alias';

// The shared module aliases are module aliases that need to work in both SSR/NodeJS + Webpack
const SharedModuleAliases = {
  // Useful to fix the react-loadable warning
  // See https://github.com/jamiebuilds/react-loadable/pull/213#issuecomment-778246548
  'react-loadable': '@docusaurus/react-loadable',
};

moduleAlias.addAliases(SharedModuleAliases);

export default SharedModuleAliases;
