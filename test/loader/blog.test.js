const path = require('path');
const fs = require('fs');
const loadBlog = require('../../lib/loader/blog');

describe('loadBlog', () => {
  const simpleDir = path.join(__dirname, '__fixtures__', 'simple');
  const customDir = path.join(__dirname, '__fixtures__', 'custom');

  test('simple', async () => {
    const blogDatas = await loadBlog(simpleDir);
    expect(blogDatas).toMatchSnapshot();
  });

  test('custom', async () => {
    const blogDatas = await loadBlog(customDir);
    expect(blogDatas).toMatchSnapshot();
  });
});
