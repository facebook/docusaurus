/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-live-codeblock' {
  export type ThemeConfig = {
    liveCodeBlock: {
      playgroundPosition: 'top' | 'bottom';
    };
  };
}

declare module '@theme/Playground' {
  import type {LiveProviderProps} from 'react-live';

  export interface Props extends LiveProviderProps {
    children: string;
  }
  export default function Playground(props: LiveProviderProps): JSX.Element;
}

declare module '@theme/ReactLiveScope' {
  type Scope = {
    [key: string]: unknown;
  };

  const ReactLiveScope: Scope;
  export default ReactLiveScope;
}
