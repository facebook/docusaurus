/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function BrowserOnly({
  children,
  fallback,
}: {
  children?: () => JSX.Element;
  fallback?: JSX.Element;
}): JSX.Element | null {
  const {isClient} = useDocusaurusContext();

  if (isClient && children != null) {
    return <>{children()}</>;
  }

  return fallback || null;
}

export default BrowserOnly;
