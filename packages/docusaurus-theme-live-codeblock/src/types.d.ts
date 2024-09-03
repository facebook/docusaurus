/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/theme-classic" />
/// <reference types="@docusaurus/module-type-aliases" />

declare module '@theme-init/CodeBlock' {
  import type CodeBlock from '@theme/CodeBlock';
  import type {Props as BaseProps} from '@theme/CodeBlock';

  export interface Props extends BaseProps {
    live?: boolean;
  }
  const CodeBlockComp: typeof CodeBlock;
  export default CodeBlockComp;
}
