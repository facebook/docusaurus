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

declare module '@theme/LiveCodeBlock' {
  import type {Props as BaseProps} from '@theme/CodeBlock';

  export interface Props extends BaseProps {}

  export default function LiveCodeBlock(props: Props): ReactNode;
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

declare module '@theme/Playground/Provider' {
  import type {ReactNode} from 'react';
  import type {Props as PlaygroundProps} from '@theme/Playground';

  export interface Props extends Omit<PlaygroundProps, 'children'> {
    code: string | undefined;
    children: ReactNode;
  }

  export default function PlaygroundProvider(props: Props): ReactNode;
}

declare module '@theme/Playground/Container' {
  import type {ReactNode} from 'react';

  export interface Props {
    children: ReactNode;
  }

  export default function PlaygroundContainer(props: Props): ReactNode;
}

declare module '@theme/Playground/Layout' {
  import type {ReactNode} from 'react';

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Props {}

  export default function PlaygroundLayout(props: Props): ReactNode;
}

declare module '@theme/Playground/Preview' {
  import type {ReactNode} from 'react';

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Props {}

  export default function PlaygroundPreview(props: Props): ReactNode;
}

declare module '@theme/Playground/Editor' {
  import type {ReactNode} from 'react';

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Props {}

  export default function PlaygroundEditor(props: Props): ReactNode;
}

declare module '@theme/Playground/Header' {
  import type {ReactNode} from 'react';

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Props {}

  export default function PlaygroundHeader(props: Props): ReactNode;
}

declare module '@theme/ReactLiveScope' {
  type Scope = {
    [key: string]: unknown;
  };

  const ReactLiveScope: Scope;
  export default ReactLiveScope;
}
