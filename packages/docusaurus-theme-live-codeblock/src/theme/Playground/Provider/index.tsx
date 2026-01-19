/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {LiveProvider} from 'react-live';
import {usePrismTheme} from '@docusaurus/theme-common';
import type {Props} from '@theme/Playground/Provider';

const DEFAULT_TRANSFORM_CODE = (code: string) => `${code};`;

interface ResetContextValue {
  resetKey: number;
  reset: () => void;
}

// eslint-disable-next-line import/no-named-export
export const PlaygroundResetContext = createContext<ResetContextValue | null>(
  null,
);

// eslint-disable-next-line import/no-named-export
export function usePlaygroundReset(): ResetContextValue {
  const context = useContext(PlaygroundResetContext);
  if (!context) {
    throw new Error(
      'usePlaygroundReset must be used within PlaygroundProvider',
    );
  }
  return context;
}

export default function PlaygroundProvider({
  code,
  children,
  ...props
}: Props): ReactNode {
  const prismTheme = usePrismTheme();
  const noInline = props.metastring?.includes('noInline') ?? false;
  const [resetKey, setResetKey] = useState(0);

  const reset = () => setResetKey((prev) => prev + 1);

  const contextValue = useMemo(() => ({resetKey, reset}), [resetKey]);

  return (
    <PlaygroundResetContext.Provider value={contextValue}>
      <LiveProvider
        key={resetKey}
        noInline={noInline}
        theme={prismTheme}
        {...props}
        code={code?.replace(/\n$/, '')}
        transformCode={props.transformCode ?? DEFAULT_TRANSFORM_CODE}>
        {children}
      </LiveProvider>
    </PlaygroundResetContext.Provider>
  );
}
