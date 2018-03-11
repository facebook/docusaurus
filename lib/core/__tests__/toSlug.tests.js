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
