/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const toSlug = require('../toSlug');

[
  ['Hello world! ', 'hello-world'],
  ['React 16', 'react-16'],
  ['Hello.   // (world?)! ', 'hello-world'],
  ['Привет мир! ', 'привет-мир'],
  ['Über Café.', 'uber-cafe'],
  ['Someting long ...', 'someting-long-'],
  ['foo_bar', 'foo_bar'],
  ['some _ heading', 'some-_-heading'],
  ["I'm good", 'im-good'],
  ['This is awes’ome', 'this-is-awesome'],
].forEach(([input, output]) => {
  test(`toSlug('${input}') -> '${output}'`, () => {
    expect(toSlug(input)).toBe(output);
  });
});

test('unique slugs if `context` argument passed', () => {
  [
    ['foo', 'foo'],
    ['foo', 'foo-1'],
    ['foo 1', 'foo-1-1'],
    ['foo 1', 'foo-1-2'],
    ['foo 2', 'foo-2'],
    ['foo', 'foo-3'],
    ['foo_bar', 'foo_bar'],
    ['some _ heading', 'some-_-heading'],
  ].reduce((context, [input, output]) => {
    expect(toSlug(input, context)).toBe(output);

    return context;
  }, {});
});
