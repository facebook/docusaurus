import path from 'path';
import loadEnv from '@lib/load/env';
import loadConfig from '@lib/load/config';

describe('loadEnv', () => {
  test('website with both versioning & translation disabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const siteConfig = loadConfig(siteDir);
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(false);
    expect(env.translation.enabled).toBe(false);
    expect(env).toMatchSnapshot();
  });

  test('website with versioning enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
    const siteConfig = loadConfig(siteDir);
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(true);
    expect(env.translation.enabled).toBe(false);
    expect(env).toMatchSnapshot();
  });

  test('website with translation enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'translated-site');
    const siteConfig = loadConfig(siteDir);
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(false);
    expect(env.translation.enabled).toBe(true);
    expect(env).toMatchSnapshot();
  });

  test('website with versioning & translation enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'transversioned-site');
    const siteConfig = loadConfig(siteDir);
    const env = loadEnv({siteDir, siteConfig});
    expect(env.versioning.enabled).toBe(true);
    expect(env.translation.enabled).toBe(true);
    expect(env).toMatchSnapshot();
  });
});
