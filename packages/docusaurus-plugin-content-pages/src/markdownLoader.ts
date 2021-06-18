/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO temporary until Webpack5 export this type
// see https://github.com/webpack/webpack/issues/11630
interface Loader extends Function {
  (this: any, source: string): string | Buffer | void | undefined;
}

const markdownLoader: Loader = function (fileString) {
  const callback = this.async();

  // const options = this.getOptions();

  // TODO provide additinal md processing here? like interlinking pages?
  // fileString = linkify(fileString)

  return callback && callback(null, fileString);
};

export default markdownLoader;
