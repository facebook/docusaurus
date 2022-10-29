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
  import type {Plugin} from '@docusaurus/types';

  export type ThemeConfig = {
    mermaid: {
      theme: {
        light: mermaidAPI.Theme;
        dark: mermaidAPI.Theme;
      };
      options: mermaidAPI.Config;
    };
  };
  export type UserThemeConfig = DeepPartial<ThemeConfig>;

  export default function themeMermaid(): Plugin<undefined>;
}

declare module '@theme/Mermaid' {
  export interface Props {
    value: string;
  }

  export default function Mermaid(props: Props): JSX.Element;
}
