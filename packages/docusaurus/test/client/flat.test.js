/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import flat from '@lib/client/flat';

describe('flat', () => {
  test('nested', () => {
    expect(
      flat({
        foo: {
          bar: {
            baz: 'lorem ipsum',
          },
        },
      }),
    ).toEqual({
      'foo.bar.baz': 'lorem ipsum',
    });

    expect(
      flat({
        foo: {
          bar: 'baz',
        },
      }),
    ).toEqual({
      'foo.bar': 'baz',
    });
  });

  test('primitives', () => {
    const primitives = {
      String: 'good morning',
      Number: 1234.99,
      Boolean: true,
      Date: new Date(),
      null: null,
      undefined,
    };
    Object.keys(primitives).forEach(key => {
      const value = primitives[key];
      expect(
        flat({
          foo: {
            bar: value,
          },
        }),
      ).toEqual({
        'foo.bar': value,
      });
    });
  });

  test('multiple keys', () => {
    expect(
      flat({
        foo: {
          bar: 'baz',
          endi: 'lie',
        },
      }),
    ).toEqual({
      'foo.bar': 'baz',
      'foo.endi': 'lie',
    });
  });

  test('empty object', () => {
    expect(
      flat({
        foo: {
          bar: {},
        },
      }),
    ).toEqual({
      'foo.bar': {},
    });
  });

  test('array', () => {
    expect(
      flat({
        hello: [{world: {again: 'foo'}}, {lorem: 'ipsum'}],
      }),
    ).toEqual({
      'hello.0.world.again': 'foo',
      'hello.1.lorem': 'ipsum',
    });
  });
});
