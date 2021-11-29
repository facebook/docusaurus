/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'prism-react-renderer/prism' {
  import type * as PrismNamespace from 'prismjs';

  const Prism: typeof PrismNamespace;
  export default Prism;
}
