/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/theme-classic" />
/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/theme-live-codeblock' {
  export type ThemeConfig = {
    liveCodeBlock: {
      playgroundPosition: 'top' | 'bottom';
    };
  };
}

declare module '@theme/Playground' {
  import type {ReactNode} from 'react';
  import type {Props as BaseProps} from '@theme/CodeBlock';
  import type {LiveProvider} from 'react-live';

  type CodeBlockProps = Omit<BaseProps, 'className' | 'language' | 'title'>;
  type LiveProviderProps = React.ComponentProps<typeof LiveProvider>;

  export interface Props extends CodeBlockProps, LiveProviderProps {
    // Allow empty live playgrounds
    children?: string;
  }
  export default function Playground(props: LiveProviderProps): ReactNode;
}

declare module '@theme/ReactLiveScope' {
  type Scope = {
    [key: string]: unknown;
  };

  const ReactLiveScope: Scope;
  export default ReactLiveScope;
}
