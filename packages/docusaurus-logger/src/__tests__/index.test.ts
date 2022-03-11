/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import logger from '../index';

describe('formatters', () => {
  test('path', () => {
    expect(logger.path('hey')).toMatchInlineSnapshot(`"[36m[4mhey[24m[39m"`);
  });
  test('id', () => {
    expect(logger.name('hey')).toMatchInlineSnapshot(`"[34m[1mhey[22m[39m"`);
  });
  test('code', () => {
    expect(logger.code('hey')).toMatchInlineSnapshot(`"[36m\`hey\`[39m"`);
  });
  test('subdue', () => {
    expect(logger.subdue('hey')).toMatchInlineSnapshot(`"[90mhey[39m"`);
  });
});

describe('interpolate', () => {
  test('should format text with variables & arrays', () => {
    const name = 'Josh';
    const items = [1, 'hi', 'Hmmm'];
    expect(logger.interpolate`Hello ${name}! Here are your goodies:${items}`)
      .toMatchInlineSnapshot(`
      "Hello Josh! Here are your goodies:
      - 1
      - hi
      - Hmmm"
    `);
  });
  test('should recognize valid flags', () => {
    expect(
      logger.interpolate`The package at path=${'packages/docusaurus'} has number=${10} files. name=${'Babel'} is exported here subdue=${'(as a preset)'} that you can with code=${"require.resolve('@docusaurus/core/lib/babel/preset')"}`,
    ).toMatchInlineSnapshot(
      `"The package at [36m[4mpackages/docusaurus[24m[39m has [33m10[39m files. [34m[1mBabel[22m[39m is exported here [90m(as a preset)[39m that you can with [36m\`require.resolve('@docusaurus/core/lib/babel/preset')\`[39m"`,
    );
  });
  test('should interpolate arrays with flags', () => {
    expect(
      logger.interpolate`The following commands are available:code=${[
        'docusaurus start',
        'docusaurus build',
        'docusaurus deploy',
      ]}`,
    ).toMatchInlineSnapshot(`
      "The following commands are available:
      - [36m\`docusaurus start\`[39m
      - [36m\`docusaurus build\`[39m
      - [36m\`docusaurus deploy\`[39m"
    `);
  });
  test('should print detached flags as-is', () => {
    expect(
      logger.interpolate`You can use placeholders like code= ${'and it will'} be replaced with the succeeding arguments`,
    ).toMatchInlineSnapshot(
      `"You can use placeholders like code= and it will be replaced with the succeeding arguments"`,
    );
  });
  test('should throw with bad flags', () => {
    expect(
      () =>
        logger.interpolate`I mistyped this: cde=${'this code'} and I will be damned`,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad Docusaurus logging message. This is likely an internal bug, please report it."`,
    );
  });
});

describe('info', () => {
  const consoleMock = jest.spyOn(console, 'info').mockImplementation(() => {});
  test('should print objects', () => {
    logger.info({a: 1});
    logger.info(undefined);
    logger.info([1, 2, 3]);
    logger.info(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "[36m[1m[INFO][22m[39m {\\"a\\":1}",
        ],
        Array [
          "[36m[1m[INFO][22m[39m undefined",
        ],
        Array [
          "[36m[1m[INFO][22m[39m 1,2,3",
        ],
        Array [
          "[36m[1m[INFO][22m[39m Sat Nov 13 2021 00:00:00 GMT+0000 (Coordinated Universal Time)",
        ],
      ]
    `);
  });
});

describe('warn', () => {
  const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  test('should print objects', () => {
    logger.warn({a: 1});
    logger.warn(undefined);
    logger.warn([1, 2, 3]);
    logger.warn(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "[33m[1m[WARNING][22m {\\"a\\":1}[39m",
        ],
        Array [
          "[33m[1m[WARNING][22m undefined[39m",
        ],
        Array [
          "[33m[1m[WARNING][22m 1,2,3[39m",
        ],
        Array [
          "[33m[1m[WARNING][22m Sat Nov 13 2021 00:00:00 GMT+0000 (Coordinated Universal Time)[39m",
        ],
      ]
    `);
  });
});

describe('error', () => {
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  test('should print objects', () => {
    logger.error({a: 1});
    logger.error(undefined);
    logger.error([1, 2, 3]);
    logger.error(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "[31m[1m[ERROR][22m {\\"a\\":1}[39m",
        ],
        Array [
          "[31m[1m[ERROR][22m undefined[39m",
        ],
        Array [
          "[31m[1m[ERROR][22m 1,2,3[39m",
        ],
        Array [
          "[31m[1m[ERROR][22m Sat Nov 13 2021 00:00:00 GMT+0000 (Coordinated Universal Time)[39m",
        ],
      ]
    `);
  });
});

describe('success', () => {
  const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
  test('should print objects', () => {
    logger.success({a: 1});
    logger.success(undefined);
    logger.success([1, 2, 3]);
    logger.success(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "[32m[1m[SUCCESS][22m[39m {\\"a\\":1}",
        ],
        Array [
          "[32m[1m[SUCCESS][22m[39m undefined",
        ],
        Array [
          "[32m[1m[SUCCESS][22m[39m 1,2,3",
        ],
        Array [
          "[32m[1m[SUCCESS][22m[39m Sat Nov 13 2021 00:00:00 GMT+0000 (Coordinated Universal Time)",
        ],
      ]
    `);
  });
});
