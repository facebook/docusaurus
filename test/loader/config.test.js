const path = require('path');
const fs = require('fs');
const loadConfig = require('../../lib/loader/config');

describe('loadConfig', () => {
  const simpleDir = path.join(__dirname, '__fixtures__', 'simple');
  const customDir = path.join(__dirname, '__fixtures__', 'custom');

  test('simple', () => {
    expect(loadConfig(simpleDir)).toMatchInlineSnapshot(`
Object {
  "description": "Hello World",
  "title": "Hello World",
}
`);
  });

  test('custom', () => {
    expect(loadConfig(customDir)).toMatchInlineSnapshot(`
Object {
  "base": "blogi",
  "description": "Hello World",
  "dest": "blogi",
  "title": "Hello World",
}
`);
  });
});
