/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {inject} from '@vercel/analytics';
import globalData from '@generated/globalData';
import type {PluginOptions} from './options';

const {debug, mode} = globalData['docusaurus-plugin-vercel-analytics']
  ?.default as PluginOptions;

inject({
  mode,
  debug,
});
