const toSlug = require('../toSlug');

[
  ['Hello world! ', 'hello-world'],
  ['React 16', 'react-16'],
  ['Hello.   // (world?)! ', 'hello-world'],
  ['Привет мир! ', 'привет-мир'],
  ['Über Café.', 'uber-cafe'],
  ['Someting long ...', 'someting-long-'],
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
  ].reduce((context, [input, output]) => {
    expect(toSlug(input, context)).toBe(output);

    return context;
  }, {});
});
