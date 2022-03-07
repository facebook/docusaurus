/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as lqip from './lqip';
import type {LoaderContext} from 'webpack';

type Options = {
  base64: boolean;
  palette: boolean;
};

export default async function lqipLoader(
  this: LoaderContext<Options>,
  contentBuffer: Buffer,
): Promise<void> {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  const imgPath = this.resourcePath;

  const config = this.getOptions() ?? {};
  config.base64 = 'base64' in config ? config.base64 : true;
  // color palette generation is set to false by default
  // since it is little bit slower than base64 generation
  config.palette = 'palette' in config ? config.palette : false;

  let content = contentBuffer.toString('utf8');
  const contentIsUrlExport =
    /^(?:export default|module.exports =) "data:.*base64,.*/.test(content);
  const contentIsFileExport = /^(?:export default|module.exports =) .*/.test(
    content,
  );

  let source = '';

  if (contentIsUrlExport) {
    source = content.match(
      /^(?:export default|module.exports =) (?<source>.*)/,
    )!.groups!.source!;
  } else {
    if (!contentIsFileExport) {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const fileLoader = require('file-loader');
      content = fileLoader.call(this, contentBuffer);
    }
    source = content.match(
      /^(?:export default|module.exports =) (?<source>.*);/,
    )!.groups!.source!;
  }

  const outputPromises: [Promise<string> | null, Promise<string[]> | null] = [
    config.base64 === true ? lqip.base64(imgPath) : null,
    config.palette === true ? lqip.palette(imgPath) : null,
  ];

  try {
    const data = await Promise.all(outputPromises);
    if (data) {
      const [preSrc, palette] = data;
      const finalObject = JSON.stringify({src: 'STUB', preSrc, palette});
      const result = `module.exports = ${finalObject.replace(
        '"STUB"',
        source,
      )};`;
      callback(null, result);
    } else {
      callback(new Error('ERROR'), undefined);
    }
  } catch (err) {
    console.error(err);
    callback(new Error('ERROR'), undefined);
  }
}

lqipLoader.raw = true;
