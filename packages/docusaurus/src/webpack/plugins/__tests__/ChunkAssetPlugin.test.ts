/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import {fromPartial} from '@total-typescript/shoehorn';
import ChunkAssetPlugin from '../ChunkAssetPlugin';
import type webpack from 'webpack';

function createHook<Args extends unknown[]>() {
  const handlers: ((...args: Args) => void)[] = [];
  return {
    call: (...args: Args) => handlers.forEach((handler) => handler(...args)),
    hook: {
      tap: (_name: string, handler: (...args: Args) => void) => {
        handlers.push(handler);
      },
    },
  };
}

describe('ChunkAssetPlugin', () => {
  it('detaches runtime modules when the compiler shuts down', () => {
    const thisCompilation = createHook<[webpack.Compilation]>();
    const shutdown = createHook<[]>();
    const additionalTreeRuntimeRequirements = createHook<[webpack.Chunk]>();
    const chunk = fromPartial<webpack.Chunk>({});
    const chunkGraph = fromPartial<webpack.ChunkGraph>({});
    const addRuntimeModule = vi.fn();
    const compilation = fromPartial<webpack.Compilation>({
      addRuntimeModule,
      hooks: {
        additionalTreeRuntimeRequirements:
          additionalTreeRuntimeRequirements.hook,
      },
    });
    addRuntimeModule.mockImplementation(
      (runtimeChunk: webpack.Chunk, runtimeModule: webpack.RuntimeModule) => {
        runtimeModule.attach(compilation, runtimeChunk, chunkGraph);
      },
    );
    const compiler = fromPartial<webpack.Compiler>({
      hooks: {
        shutdown: shutdown.hook,
        thisCompilation: thisCompilation.hook,
      },
    });

    new ChunkAssetPlugin().apply(compiler);
    thisCompilation.call(compilation);
    additionalTreeRuntimeRequirements.call(chunk);

    const runtimeModule = addRuntimeModule.mock
      .calls[0]![1] as webpack.RuntimeModule;
    expect(runtimeModule.compilation).toBe(compilation);
    expect(runtimeModule.chunk).toBe(chunk);
    expect(runtimeModule.chunkGraph).toBe(chunkGraph);

    shutdown.call();

    expect(runtimeModule.compilation).toBeUndefined();
    expect(runtimeModule.chunk).toBeUndefined();
    expect(runtimeModule.chunkGraph).toBeUndefined();
  });
});
