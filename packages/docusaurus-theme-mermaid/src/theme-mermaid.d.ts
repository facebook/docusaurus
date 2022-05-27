/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/theme-mermaid' {
  import type {DeepPartial} from 'utility-types';
  import type mermaidAPI from 'mermaid/mermaidAPI';

  export type ThemeConfig = {
    mermaid: {
      theme?: {
        light: mermaidAPI.Theme;
        dark: mermaidAPI.Theme;
        [htmlTheme: string]: mermaidAPI.Theme;
      };
      config?: mermaidAPI.Config;
    };
  };
  export type UserThemeConfig = DeepPartial<ThemeConfig>;
}

declare module '@docusaurus/theme-mermaid/theme/MDXComponents/Mermaid' {
  export interface Props {
    value: string;
  }

  export default function MDXMermaid(props: Props): JSX.Element;
}

declare module '@docusaurus/theme-mermaid/theme/useMermaid' {
  export default function useMermaid(): void;
}

declare module '@docusaurus/theme-mermaid/theme/Mermaid' {
  export interface Props {
    value: string;
  }

  export default function Mermaid(props: Props): JSX.Element;
}
