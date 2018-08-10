import path from 'path';
import loadConfig from '@lib/load/config';

describe('loadConfig', () => {
  test('website with valid siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const config = loadConfig(siteDir);
    expect(config).toEqual({
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello'
    });
    expect(config).not.toEqual({});
  });

  test('website with incomplete siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"tagline, organizationName, projectName are missing in siteConfig.js"`
    );
  });

  test('website with no siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"title, tagline, organizationName, projectName, baseUrl are missing in siteConfig.js"`
    );
  });
});
