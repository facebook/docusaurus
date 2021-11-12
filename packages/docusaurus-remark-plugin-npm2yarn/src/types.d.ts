/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Literal} from 'mdast';

declare module 'mdast' {
  interface BlockContentMap {
    jsx: JSX;
    import: Import;
    export: Export;
  }

  export interface JSX extends Literal, Optional<Parent> {
    type: 'jsx';
  }

  export interface Import extends Literal {
    type: 'import';
  }

  export interface Export extends Literal {
    type: 'export';
  }
}
