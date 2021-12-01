/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const NODE_MAJOR_VERSION = parseInt(
  process.versions.node.split('.')[0],
  10,
);
export const NODE_MINOR_VERSION = parseInt(
  process.versions.node.split('.')[1],
  10,
);

// Can be overridden with cli option --out-dir
export const DEFAULT_BUILD_DIR_NAME = 'build';

// Can be overridden with cli option --config
export const DEFAULT_CONFIG_FILE_NAME = 'docusaurus.config.js';

export const GENERATED_FILES_DIR_NAME =
  process.env.DOCUSAURUS_GENERATED_FILES_DIR_NAME || '.docusaurus';

export const SRC_DIR_NAME = 'src';
export const STATIC_DIR_NAME = 'static';
export const THEME_PATH = `${SRC_DIR_NAME}/theme`;
export const DEFAULT_PORT = 3000;
export const DEFAULT_PLUGIN_ID = 'default';
