/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {queueFileOperation} from '../queue';

describe('queueFileOperation', () => {
  it('bounds the number of concurrent operations', async () => {
    let running = 0;
    let maxRunning = 0;
    const results = await Promise.all(
      Array.from({length: 500}, (_, i) =>
        queueFileOperation(async () => {
          running += 1;
          maxRunning = Math.max(maxRunning, running);
          await new Promise((resolve) => {
            setTimeout(resolve, 1);
          });
          running -= 1;
          return i;
        }),
      ),
    );
    expect(results).toEqual(Array.from({length: 500}, (_, i) => i));
    expect(maxRunning).toBe(100);
  });

  it('propagates errors', async () => {
    await expect(
      queueFileOperation(() => Promise.reject(new Error('Some error'))),
    ).rejects.toThrow('Some error');
  });
});
