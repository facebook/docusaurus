/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loader} from 'webpack';
import {getOptions} from 'loader-utils';

const markdownLoader: loader.Loader = function (fileString) {
  const callback = this.async();

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const options = getOptions(this);

  // TODO provide additinal md processing here? like interlinking pages?
  // fileString = linkify(fileString)

  return callback && callback(null, fileString);
};

export default markdownLoader;
