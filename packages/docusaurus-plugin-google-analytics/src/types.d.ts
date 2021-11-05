/**
 * Copyright (c) Meta. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

interface Window {
  ga: (command: string, ...fields: string[]) => void;
}
