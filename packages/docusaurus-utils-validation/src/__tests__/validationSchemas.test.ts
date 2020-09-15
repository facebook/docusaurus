/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';

import {
  AdmonitionsSchema,
  RehypePluginsSchema,
  RemarkPluginsSchema,
  PluginIdSchema,
  URISchema,
} from '../validationSchemas';

function createTestHelpers({
  schema,
  defaultValue,
}: {
  schema: Joi.SchemaLike;
  defaultValue?: unknown;
}) {
  function testOK(value: unknown) {
    expect(Joi.attempt(value, schema)).toEqual(value ?? defaultValue);
  }

  function testFail(value: unknown) {
    expect(() => Joi.attempt(value, schema)).toThrowErrorMatchingSnapshot(
      // @ts-expect-error: seems ok at runtime, but bad typedef
      `for value=${JSON.stringify(value)}`,
    );
  }

  return {testOK, testFail};
}

function testMarkdownPluginSchemas(schema: Joi.SchemaLike) {
  const {testOK, testFail} = createTestHelpers({
    schema,
    defaultValue: [],
  });

  testOK(undefined);
  testOK([function () {}]);
  testOK([[function () {}, {attr: 'val'}]]);
  testOK([
    [function () {}, {attr: 'val'}],
    function () {},
    [function () {}, {attr: 'val'}],
  ]);

  testFail(null);
  testFail(false);
  testFail(3);
  testFail([null]);
  testFail([false]);
  testFail([3]);
  testFail([[]]);
  testFail([[function () {}, undefined]]);
  testFail([[function () {}, true]]);
}

describe('validation schemas', () => {
  test('PluginIdSchema', () => {
    const {testOK, testFail} = createTestHelpers({
      schema: PluginIdSchema,
      defaultValue: 'default',
    });

    testOK(undefined);
    testOK('docs');
    testOK('default');
    testOK('plugin-id_with-simple-special-chars');

    testFail('/docs');
    testFail('docs/');
    testFail('do/cs');
    testFail('do cs');
    testFail(null);
    testFail(3);
    testFail(true);
    testFail([]);
  });

  test('AdmonitionsSchema', () => {
    const {testOK, testFail} = createTestHelpers({
      schema: AdmonitionsSchema,
      defaultValue: {},
    });

    testOK(undefined);
    testOK({});
    testOK({attr: 'val'});

    testFail(null);
    testFail(3);
    testFail(true);
    testFail([]);
  });

  test('RemarkPluginsSchema', () => {
    testMarkdownPluginSchemas(RemarkPluginsSchema);
  });

  test('RehypePluginsSchema', () => {
    testMarkdownPluginSchemas(RehypePluginsSchema);
  });

  test('URISchema', () => {
    const validURL = 'https://docusaurus.io';
    const doubleHash = 'https://docusaurus.io#github#/:';
    const relativeUrl = '//docusaurus.io';
    const invalidURL = 'invalidURL';
    const urlFromIssue = 'https://riot.im/app/#/room/#ligo-public:matrix.org';

    const {testFail, testOK} = createTestHelpers({schema: URISchema});
    testOK(validURL);
    testOK(doubleHash);
    testOK(relativeUrl);
    testFail(invalidURL);
    testOK(urlFromIssue);
  });
});
