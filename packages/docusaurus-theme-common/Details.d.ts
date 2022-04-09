/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// `Details` is a separate export entry because of side-effects messing with CSS
// insertion order. See https://github.com/facebook/docusaurus/pull/7085.
// However, because TS doesn't recognize `exports` (also a problem in
// `content-docs`), we have to manually create a stub.

// eslint-disable-next-line import/named
export {Details, type DetailsProps} from './lib/components/Details';
