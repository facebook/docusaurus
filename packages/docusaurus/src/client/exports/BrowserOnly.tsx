/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import React, {Suspense, isValidElement, type ReactNode} from 'react';
import * as ReactDOM from 'react-dom';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props as DocusaurusProps} from '@docusaurus/BrowserOnly';

export interface Props extends DocusaurusProps {
  /**
   * Optional explanation or reason factory for why this component is browser-only.
   * On React 19.3+, this is passed to `react-dom`'s `browser(reason)` API and
   * becomes the `cause` of the Error delivered to `onBrowserBailout`.
   */
  reason?: string | (() => unknown);
}

type ReactWithUse = typeof React & {
  use?: <T>(usable: unknown) => T;
};

type ReactDOMWithBrowser = typeof ReactDOM & {
  browser?: (reason?: string | (() => unknown)) => unknown;
};

const reactUse = (React as ReactWithUse).use;
const reactDomBrowser = (ReactDOM as ReactDOMWithBrowser).browser;
const hasBrowserApi =
  typeof reactUse === 'function' && typeof reactDomBrowser === 'function';

function BrowserOnlyModernContent({
  children,
  reason,
}: {
  children?: () => ReactNode;
  reason?: string | (() => unknown);
}): ReactNode {
  reactUse!(
    reactDomBrowser!(
      reason ??
        (() =>
          new Error(
            'This component was marked as browser-only using Docusaurus <BrowserOnly>.',
          )),
    ),
  );

  return <>{children?.()}</>;
}

function BrowserOnlyModern({children, fallback, reason}: Props): ReactNode {
  return (
    <Suspense fallback={fallback ?? null}>
      <BrowserOnlyModernContent reason={reason}>
        {children}
      </BrowserOnlyModernContent>
    </Suspense>
  );
}

function BrowserOnlyLegacy({children, fallback}: Props): ReactNode {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    return <>{children?.()}</>;
  }

  return fallback ?? null;
}

function validateChildren(children: unknown): void {
  if (
    typeof children !== 'function' &&
    process.env.NODE_ENV === 'development'
  ) {
    throw new Error(
      `Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.\n` +
        `Current type: ${isValidElement(children) ? 'React element' : typeof children}`,
    );
  }
}

export default function BrowserOnly(props: Props): ReactNode {
  const {children, fallback} = props;

  validateChildren(children);

  if (typeof children !== 'function') {
    return fallback ?? null;
  }

  if (hasBrowserApi) {
    return <BrowserOnlyModern {...props} />;
  }

  return <BrowserOnlyLegacy {...props} />;
}
