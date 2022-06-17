/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import logger from '../index';

// cSpell:ignore mkeep

describe('formatters', () => {
  it('path', () => {
    expect(logger.path('keepAnsi')).toMatchInlineSnapshot(`"[36m[4m"keepAnsi"[24m[39m"`);
  });
  it('url', () => {
    expect(logger.url('https://docusaurus.io/keepAnsi')).toMatchInlineSnapshot(
      `"[36m[4mhttps://docusaurus.io/keepAnsi[24m[39m"`,
    );
  });
  it('id', () => {
    expect(logger.name('keepAnsi')).toMatchInlineSnapshot(`"[34m[1mkeepAnsi[22m[39m"`);
  });
  it('code', () => {
    expect(logger.code('keepAnsi')).toMatchInlineSnapshot(`"[36m\`keepAnsi\`[39m"`);
  });
  it('subdue', () => {
    expect(logger.subdue('keepAnsi')).toMatchInlineSnapshot(`"[90mkeepAnsi[39m"`);
  });
});

describe('interpolate', () => {
  it('formats text with variables & arrays', () => {
    const name = 'Josh';
    const items = [1, 'hi', 'Hmmm'];
    expect(
      logger.interpolate`(keepAnsi) Hello ${name}! Here are your goodies:${items}`,
    ).toMatchInlineSnapshot(`
      "(keepAnsi) Hello Josh! Here are your goodies:
      - 1
      - hi
      - Hmmm"
    `);
  });
  it('recognizes valid flags', () => {
    expect(
      logger.interpolate`(keepAnsi) The package at path=${'packages/docusaurus'} has number=${10} files. name=${'Babel'} is exported here subdue=${'(as a preset)'} that you can with code=${"require.resolve('@docusaurus/core/lib/babel/preset')"}`,
    ).toMatchInlineSnapshot(
      `"(keepAnsi) The package at [36m[4m"packages/docusaurus"[24m[39m has [33m10[39m files. [34m[1mBabel[22m[39m is exported here [90m(as a preset)[39m that you can with [36m\`require.resolve('@docusaurus/core/lib/babel/preset')\`[39m"`,
    );
  });
  it('interpolates arrays with flags', () => {
    expect(
      logger.interpolate`(keepAnsi) The following commands are available:code=${[
        'docusaurus start',
        'docusaurus build',
        'docusaurus deploy',
      ]}`,
    ).toMatchInlineSnapshot(`
      "(keepAnsi) The following commands are available:
      - [36m\`docusaurus start\`[39m
      - [36m\`docusaurus build\`[39m
      - [36m\`docusaurus deploy\`[39m"
    `);
  });
  it('prints detached flags as-is', () => {
    expect(
      logger.interpolate`(keepAnsi) You can use placeholders like code= ${'and it will'} be replaced with the succeeding arguments`,
    ).toMatchInlineSnapshot(
      `"(keepAnsi) You can use placeholders like code= and it will be replaced with the succeeding arguments"`,
    );
  });
  it('throws with bad flags', () => {
    expect(
      () =>
        logger.interpolate`(keepAnsi) I mistyped this: cde=${'this code'} and I will be damned`,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad Docusaurus logging message. This is likely an internal bug, please report it."`,
    );
  });
});

describe('info', () => {
  const consoleMock = jest.spyOn(console, 'info').mockImplementation(() => {});
  it('prints objects', () => {
    logger.info({a: 1});
    logger.info(undefined);
    logger.info([1, 2, 3]);
    logger.info(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchSnapshot();
  });
});

describe('warn', () => {
  const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  it('prints objects', () => {
    logger.warn({a: 1});
    logger.warn(undefined);
    logger.warn([1, 2, 3]);
    logger.warn(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchSnapshot();
  });
});

describe('error', () => {
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  it('prints objects', () => {
    logger.error({a: 1});
    logger.error(undefined);
    logger.error([1, 2, 3]);
    logger.error(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchSnapshot();
  });
});

describe('success', () => {
  const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
  it('prints objects', () => {
    logger.success({a: 1});
    logger.success(undefined);
    logger.success([1, 2, 3]);
    logger.success(new Date(2021, 10, 13));
    expect(consoleMock.mock.calls).toMatchSnapshot();
  });
});

describe('report', () => {
  beforeAll(() => jest.clearAllMocks());
  it('works with all severities', () => {
    const consoleLog = jest.spyOn(console, 'info').mockImplementation(() => {});
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    logger.report('ignore')('hey');
    logger.report('log')('hey');
    logger.report('warn')('hey');
    expect(() =>
      logger.report('throw')('hey'),
    ).toThrowErrorMatchingInlineSnapshot(`"hey"`);
    expect(() =>
      // @ts-expect-error: for test
      logger.report('foo')('hey'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected "reportingSeverity" value: foo."`,
    );
    expect(consoleLog).toBeCalledTimes(1);
    expect(consoleLog).toBeCalledWith(
      expect.stringMatching(/.*\[INFO\].* hey/),
    );
    expect(consoleWarn).toBeCalledTimes(1);
    expect(consoleWarn).toBeCalledWith(
      expect.stringMatching(/.*\[WARNING\].* hey/),
    );
  });
});
