import path from 'path';
import loadEnv from '@lib/load/env';

describe('loadEnv', () => {
  test('website with both versioning & translation disabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
    };
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(false);
    expect(env.translation.enabled).toBe(false);
    expect(env).toMatchSnapshot();
  });

  test('website with versioning enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
    };
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(true);
    expect(env.translation.enabled).toBe(false);
    expect(env).toMatchSnapshot();
  });

  test('website with translation enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'translated-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
      defaultLanguage: 'en',
    };
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(false);
    expect(env.translation.enabled).toBe(true);
    expect(env).toMatchSnapshot();
  });

  test('website with versioning & translation enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'transversioned-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
      defaultLanguage: 'en',
    };
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(true);
    expect(env.translation.enabled).toBe(true);
    expect(env).toMatchSnapshot();
  });

  test('website with languages.js but no lang is enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
    };
    expect(() => {
      loadEnv({siteDir, siteConfig});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Please at least enable one language in 'languages.js'"`,
    );
  });

  test('website with languages.js but no default language set', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'translated-site');
    const siteConfig = {
      baseUrl: '/',
      organizationName: 'endiliey',
      projectName: 'hello',
      tagline: 'Hello World',
      title: 'Hello',
    };
    expect(() => {
      loadEnv({siteDir, siteConfig});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Please set a default language in 'siteConfig.js' which is enabled in 'languages.js'"`,
    );
  });
});
