/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
