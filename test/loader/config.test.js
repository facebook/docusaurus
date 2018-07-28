const path = require('path');
const fs = require('fs');
const loadConfig = require('../../lib/loader/config');

describe('loadConfig', () => {
  const simpleDir = path.join(__dirname, '__fixtures__', 'simple');
  const customDir = path.join(__dirname, '__fixtures__', 'custom');

  test('simple', () => {
    expect(loadConfig(simpleDir)).toMatchSnapshot();
  });

  test('custom', () => {
    expect(loadConfig(customDir)).toMatchSnapshot();
  });
});
