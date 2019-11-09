import path from 'path';
import loadEnv from '../env';

describe('loadEnv', () => {
  test('website with both versioning & translation disabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const env = loadEnv(siteDir);
    expect(env.versioning.enabled).toBe(false);
  });

  test('website with versioning enabled', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
    const env = loadEnv(siteDir);
    expect(env.versioning.enabled).toBe(true);
    expect(env).toMatchInlineSnapshot(`
      Object {
        "versioning": Object {
          "enabled": true,
          "latestVersion": "1.0.1",
          "versions": Array [
            "1.0.1",
            "1.0.0",
          ],
        },
      }
    `);
  });

  test('website with invalid versions.json file', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
    const env = loadEnv(siteDir);
    expect(env.versioning.enabled).toBe(false);
  });
});
