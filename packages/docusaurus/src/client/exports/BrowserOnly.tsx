/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Suspense, use, type ReactNode} from 'react';
import * as ReactDOM from 'react-dom';
import useIsBrowser from '@docusaurus/useIsBrowser';

export interface BrowserOnlyProps {
  children?: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
  reason?: string | (() => unknown);
}

// Feature detect React DOM's native browser() API
const hasNativeBrowser = typeof (ReactDOM as any).browser === 'function';

function ModernBrowserOnlyInner({
  children,
  reason,
}: {
  children?: ReactNode | (() => ReactNode);
  reason?: string | (() => unknown);
}) {
  use((ReactDOM as any).browser(reason));
  return <>{typeof children === 'function' ? children() : children}</>;
}

function LegacyBrowserOnly({
  children,
  fallback = null,
}: {
  children?: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
}) {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    return <>{typeof children === 'function' ? children() : children}</>;
  }

  return <>{fallback}</>;
}

export default function BrowserOnly({
  children,
  fallback = null,
  reason = 'Component requires browser-only APIs.',
}: BrowserOnlyProps): ReactNode {
  if (hasNativeBrowser) {
    return (
      <Suspense fallback={fallback}>
        <ModernBrowserOnlyInner reason={reason}>
          {children}
        </ModernBrowserOnlyInner>
      </Suspense>
    );
  }

  return <LegacyBrowserOnly fallback={fallback}>{children}</LegacyBrowserOnly>;
}
