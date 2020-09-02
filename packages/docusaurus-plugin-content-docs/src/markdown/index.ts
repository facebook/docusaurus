/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getOptions} from 'loader-utils';
import {loader} from 'webpack';
import {linkify} from './linkify';
import {DocsMarkdownOption} from '../types';

const markdownLoader: loader.Loader = function (source) {
  const fileString = source as string;
  const callback = this.async();
  const options = getOptions(this) as DocsMarkdownOption;
  return (
    callback && callback(null, linkify(fileString, this.resourcePath, options))
  );
};

export default markdownLoader;
