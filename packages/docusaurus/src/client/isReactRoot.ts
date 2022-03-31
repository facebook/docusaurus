/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import semver from 'semver';

/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

export function isReactRoot(): boolean {
  const reactDomVersion = require('react-dom').version;
  const isReactExperimental = Boolean(
    reactDomVersion && /0\.0\.0-experimental/.test(reactDomVersion),
  );
  const hasReact18: boolean =
    Boolean(reactDomVersion) &&
    (semver.gte(reactDomVersion!, '18.0.0') ||
      semver.coerce(reactDomVersion)?.version === '18.0.0');

  return hasReact18 || isReactExperimental;
}
