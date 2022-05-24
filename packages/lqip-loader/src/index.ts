/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as lqip from './lqip';
import type {LoaderContext, LoaderModule} from 'webpack';

type Options = {
  base64: boolean;
  palette: boolean;
};

export default async function lqipLoader(
  this: LoaderContext<Options>,
  contentBuffer: Buffer,
): Promise<void> {
  this.cacheable();
  const callback = this.async();
  const imgPath = this.resourcePath;
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
      const fileLoader = require('file-loader') as LoaderModule['default'];
      // @ts-expect-error: type is a bit unwieldy...
      content = fileLoader!.call(this, contentBuffer) as string;
    }
    source = content.match(
      /^(?:export default|module.exports =) (?<source>.*);/,
    )!.groups!.source!;
  }

  try {
    const preSrc = await lqip.base64(imgPath);
    const finalObject = JSON.stringify({src: 'STUB', preSrc});
    const result = `module.exports = ${finalObject.replace('"STUB"', source)};`;
    callback(null, result);
  } catch (err) {
    console.error(err);
    callback(new Error('ERROR'), undefined);
  }
}

lqipLoader.raw = true;
