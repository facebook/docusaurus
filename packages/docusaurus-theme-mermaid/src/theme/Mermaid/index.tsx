/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  ErrorBoundaryErrorMessageFallback,
  useTabBecameVisibleCallback,
} from '@docusaurus/theme-common/internal';
import {
  MermaidContainerClassName,
  useMermaidRenderResult,
} from '@docusaurus/theme-mermaid/client';
import type {Props} from '@theme/Mermaid';
import type {RenderResult} from 'mermaid';

import styles from './styles.module.css';

function MermaidRenderResult({
  renderResult,
  onTabBecameVisible,
}: {
  renderResult: RenderResult;
  onTabBecameVisible: () => void;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useTabBecameVisibleCallback(ref, onTabBecameVisible);

  useEffect(() => {
    const div = ref.current!;
    renderResult.bindFunctions?.(div);
  }, [renderResult]);

  return (
    <div
      ref={ref}
      className={`${MermaidContainerClassName} ${styles.container}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: renderResult.svg}}
    />
  );
}

function MermaidRenderer({value}: Props): ReactNode {
  const [renderCounter, setRenderCounter] = useState(0);
  const renderResult = useMermaidRenderResult({text: value, renderCounter});
  if (renderResult === null) {
    return null;
  }
  return (
    <MermaidRenderResult
      renderResult={renderResult}
      onTabBecameVisible={() => {
        setRenderCounter((value) => value + 1);
      }}
    />
  );
}

export default function Mermaid(props: Props): ReactNode {
  return (
    <ErrorBoundary
      fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
      <MermaidRenderer {...props} />
    </ErrorBoundary>
  );
}
