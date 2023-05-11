/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import {createProcessor} from '../processor';
// import type {Options} from '../loader';

/*
async function testProcess({
  format,
  options,
}: {
  format: 'md' | 'mdx';
  options: Options;
}) {
  return async (content: string) => {
    const processor = await createProcessor({format, options});
    return processor.process(content);
  };
}
 */

describe('md processor', () => {
  it('parses simple commonmark', async () => {
    // TODO no tests for now, wait until ESM support
    // Jest does not support well ESM modules
    // It would require to vendor too much Unified modules as CJS
    // See https://mdxjs.com/docs/troubleshooting-mdx/#esm
  });
});
