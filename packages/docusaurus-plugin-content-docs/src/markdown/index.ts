/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-nocheck

import {linkify} from './linkify';

const markdownLoader = function (source) {
  const fileString = source as string;
  const callback = this.async();
  const options = this.getOptions();
  return (
    callback && callback(null, linkify(fileString, this.resourcePath, options))
  );
};

export default markdownLoader;
