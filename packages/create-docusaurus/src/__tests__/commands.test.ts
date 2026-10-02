/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {afterEach, describe, expect, it, vi} from 'vitest';
import {runCommand} from '../commands';

function spyOnOutput() {
  const writes: string[] = [];
  const spy = (name: 'stdout' | 'stderr') =>
    vi.spyOn(process[name], 'write').mockImplementation((chunk) => {
      writes.push(`${name}:${String(chunk)}`);
      return true;
    });
  spy('stdout');
  spy('stderr');
  return writes;
}

// Writes interleaved stdout/stderr output, then exits with the given code
function nodeScriptArgs(exitCode: number): string[] {
  return [
    '-e',
    `process.stdout.write('out1');
     setTimeout(() => process.stderr.write('err1'), 50);
     setTimeout(() => process.stdout.write('out2'), 100);
     setTimeout(() => process.exit(${exitCode}), 150);`,
  ];
}

describe('runCommand', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the exit code', async () => {
    await expect(runCommand('node', nodeScriptArgs(0))).resolves.toBe(0);
    await expect(runCommand('node', nodeScriptArgs(3))).resolves.toBe(3);
  });

  it('does not print output by default', async () => {
    const writes = spyOnOutput();
    await expect(runCommand('node', nodeScriptArgs(1))).resolves.toBe(1);
    expect(writes).toEqual([]);
  });

  it('does not print output on success with printOutputOnFailure', async () => {
    const writes = spyOnOutput();
    await expect(
      runCommand('node', nodeScriptArgs(0), {printOutputOnFailure: true}),
    ).resolves.toBe(0);
    expect(writes).toEqual([]);
  });

  it('prints output in order on failure with printOutputOnFailure', async () => {
    const writes = spyOnOutput();
    await expect(
      runCommand('node', nodeScriptArgs(1), {printOutputOnFailure: true}),
    ).resolves.toBe(1);
    expect(writes).toEqual(['stdout:out1', 'stderr:err1', 'stdout:out2']);
  });
});
