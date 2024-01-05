/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type PluginOptions = {
  id: string;
  mode: 'auto' | 'production' | 'development';
  debug: boolean;
};

export type Options = Partial<PluginOptions>;
