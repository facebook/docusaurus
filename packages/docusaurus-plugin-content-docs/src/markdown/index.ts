/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getOptions} from 'loader-utils';
import {loader} from 'webpack';
import linkify from './linkify';

export = function(fileString: string) {
  const callback = this.async();
  const {docsDir, siteDir, sourceToPermalink} = getOptions(this);
  return (
    callback &&
    callback(
      null,
      linkify(
        fileString,
        this.resourcePath,
        docsDir,
        siteDir,
        sourceToPermalink,
      ),
    )
  );
} as loader.Loader;
