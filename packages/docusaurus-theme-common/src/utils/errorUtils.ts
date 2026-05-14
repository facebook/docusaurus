/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Reports a recoverable client-side error.
 *
 * Uses the standard `reportError()` API when available so host-page error
 * listeners (e.g. `window.onerror`, Sentry's global handler) can capture it.
 * Falls back to `console.error` in environments where `reportError` does not
 * exist (older browsers, some test runners).
 *
 * See https://github.com/facebook/docusaurus/issues/6747
 */
export function reportRecoverableError(error: unknown): void {
  if (typeof globalThis.reportError === 'function') {
    globalThis.reportError(error);
  } else {
    console.error(error);
  }
}
