/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {linkify} from './linkify';
import {DocsMarkdownOption} from '../types';

// TODO temporary until Webpack5 export this type
// see https://github.com/webpack/webpack/issues/11630
interface Loader extends Function {
  (this: any, source: string): string | Buffer | void | undefined;
}

const markdownLoader: Loader = function (source) {
  const fileString = source as string;
  const callback = this.async();
  const options = this.getOptions() as DocsMarkdownOption;
  return (
    callback && callback(null, linkify(fileString, this.resourcePath, options))
  );
};

export default markdownLoader;
