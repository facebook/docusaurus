/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {LiveProvider} from 'react-live';
import {usePrismTheme, useThemeConfig} from '@docusaurus/theme-common';
import PlaygroundPreview from '@theme/Playground/Preview';
import PlaygroundEditor from '@theme/Playground/Editor';

import type {Props} from '@theme/Playground';
import type {ThemeConfig} from '@docusaurus/theme-live-codeblock';

import styles from './styles.module.css';

// this should rather be a stable function
// see https://github.com/facebook/docusaurus/issues/9630#issuecomment-1855682643
const DEFAULT_TRANSFORM_CODE = (code: string) => `${code};`;

type PlaygroundProviderProps = Omit<Props, 'children'> & {
  code: string | undefined;
  children: ReactNode;
};

function PlaygroundProvider(props: PlaygroundProviderProps): ReactNode {
  const prismTheme = usePrismTheme();
  const noInline = props.metastring?.includes('noInline') ?? false;
  return (
    <LiveProvider
      noInline={noInline}
      theme={prismTheme}
      {...props}
      code={props.code?.replace(/\n$/, '')}
      transformCode={props.transformCode ?? DEFAULT_TRANSFORM_CODE}>
      <PlaygroundContent />
    </LiveProvider>
  );
}

function useLiveCodeBlockThemeConfig() {
  const themeConfig = useThemeConfig() as unknown as ThemeConfig;
  return themeConfig.liveCodeBlock;
}

function PlaygroundContent(): ReactNode {
  const {playgroundPosition} = useLiveCodeBlockThemeConfig();
  return (
    <>
      {playgroundPosition === 'top' ? (
        <>
          <PlaygroundPreview />
          <PlaygroundEditor />
        </>
      ) : (
        <>
          <PlaygroundEditor />
          <PlaygroundPreview />
        </>
      )}
    </>
  );
}

export default function Playground({
  children,
  transformCode,
  ...props
}: Props): ReactNode {
  return (
    <div className={styles.playgroundContainer}>
      <PlaygroundProvider code={children} {...props}>
        <PlaygroundContent />
      </PlaygroundProvider>
    </div>
  );
}
