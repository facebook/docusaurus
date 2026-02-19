/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import PlaygroundPreview from '@theme/Playground/Preview';
import PlaygroundEditor from '@theme/Playground/Editor';

import type {ThemeConfig} from '@docusaurus/theme-live-codeblock';

function useLiveCodeBlockThemeConfig() {
  const themeConfig = useThemeConfig() as unknown as ThemeConfig;
  return themeConfig.liveCodeBlock;
}

function usePlaygroundPosition() {
  const themeConfig = useLiveCodeBlockThemeConfig();
  return themeConfig.playgroundPosition;
}

export default function PlaygroundLayout(): ReactNode {
  const playgroundPosition = usePlaygroundPosition();
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
