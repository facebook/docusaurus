/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/// <reference types="@docusaurus/module-type-aliases" />

interface Window {
  gtag: (
    command: string,
    fields: string,
    params: {
      page_title?: string;
      page_location?: string;
      page_path?: string;
    },
  ) => void;
}
