/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@mapbox/hast-util-to-jsx' {
  import type {Node} from 'unist';

  export default function toJsx(node: Node): string;
}

declare module 'hast-util-to-string' {
  import type {Node} from 'unist';

  export default function toString(node: Node): string;
}
