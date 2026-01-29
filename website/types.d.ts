/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This is a bad workaround to make our site typecheck under React 19
// We run our site with "skipLibCheck=false", unfortunately some libraries
// are still using the global JSX namespace, that has been removed in v19
// See https://react.dev/blog/2024/04/25/react-19-upgrade-guide#the-jsx-namespace-in-typescript
declare namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ElementClass {}
}
