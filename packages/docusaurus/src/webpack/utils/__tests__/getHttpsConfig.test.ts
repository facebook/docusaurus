/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {afterEach, describe, expect, it, vi} from 'vitest';
import path from 'path';
import getHttpsConfig from '../getHttpsConfig';

describe('getHttpsConfig', () => {
  function getFixture(name: string) {
    return path.join(__dirname, '__fixtures__/getHttpsConfig', name);
  }

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns true for HTTPS not env', async () => {
    await expect(getHttpsConfig()).resolves.toBe(false);
  });

  it('returns true for HTTPS in env', async () => {
    vi.stubEnv('HTTPS', 'true');
    await expect(getHttpsConfig()).resolves.toBe(true);
  });

  it('returns custom certs if they are in env', async () => {
    vi.stubEnv('HTTPS', 'true');
    vi.stubEnv('SSL_CRT_FILE', getFixture('host.crt'));
    vi.stubEnv('SSL_KEY_FILE', getFixture('host.key'));

    await expect(getHttpsConfig()).resolves.toEqual({
      key: expect.any(Buffer),
      cert: expect.any(Buffer),
    });
  });

  it("throws if file doesn't exist", async () => {
    vi.stubEnv('HTTPS', 'true');
    vi.stubEnv('SSL_CRT_FILE', getFixture('nonexistent.crt'));
    vi.stubEnv('SSL_KEY_FILE', getFixture('host.key'));
    await expect(getHttpsConfig()).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You specified SSL_CRT_FILE in your env, but the file "<PROJECT_ROOT>/packages/docusaurus/src/webpack/utils/__tests__/__fixtures__/getHttpsConfig/nonexistent.crt" can't be found.]`,
    );
  });

  it('throws for invalid key', async () => {
    vi.stubEnv('HTTPS', 'true');
    vi.stubEnv('SSL_CRT_FILE', getFixture('host.crt'));
    vi.stubEnv('SSL_KEY_FILE', getFixture('invalid.key'));
    await expect(getHttpsConfig()).rejects.toThrow();
  });

  it('throws for invalid cert', async () => {
    vi.stubEnv('HTTPS', 'true');
    vi.stubEnv('SSL_CRT_FILE', getFixture('invalid.crt'));
    vi.stubEnv('SSL_KEY_FILE', getFixture('host.key'));
    await expect(getHttpsConfig()).rejects.toThrow();
  });
});
