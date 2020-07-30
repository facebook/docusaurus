/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface Node {
  /**
   * The variant of a node.
   */
  type: string;

  /**
   * Information from the ecosystem.
   */
  data?: unknown;

  /**
   * Location of a node in a source document.
   * Must not be present if a node is generated.
   */
  position?: unknown;

  [key: string]: unknown;
}

export interface DataNode {
  type: string;
  anchor?: string;
  body: string;
  heading?: string;
}

export interface pluginOptions {
  include: Array<string>;
  exclude: Array<string>;
}
