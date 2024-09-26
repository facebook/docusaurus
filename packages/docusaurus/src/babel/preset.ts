/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO Docusaurus v4, do breaking change and expose babel preset cleanly
/*
this just ensure retro-compatibility with our former init template .babelrc.js:

module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
 */
import BabelPreset from '@docusaurus/babel/preset';

export default BabelPreset;
