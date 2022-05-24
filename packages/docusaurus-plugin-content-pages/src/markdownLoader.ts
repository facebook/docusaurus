/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoaderContext} from 'webpack';

export default function markdownLoader(
  this: LoaderContext<undefined>,
  fileString: string,
): void {
  const callback = this.async();

  // const options = this.getOptions();

  // TODO provide additional md processing here? like interlinking pages?
  // fileString = linkify(fileString)

  return callback(null, fileString);
}
