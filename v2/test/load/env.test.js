/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadEnv from '@lib/load/env';
import loadSetup from '../loadSetup';

describe('loadEnv', () => {
  test('website with both versioning & translation disabled', async () => {
    const {siteDir} = await loadSetup('simple');
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

  test('website with versioning enabled', async () => {
    const {siteDir} = await loadSetup('versioned');
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

  test('website with translation enabled', async () => {
    const {siteDir} = await loadSetup('translated');
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

  test('website with versioning & translation enabled', async () => {
    const {siteDir} = await loadSetup('transversioned');
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

  test('website with languages.js but no default language set', async () => {
    const {siteDir} = await loadSetup('translated');
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
      `"Please set a default language in 'docusaurus.config.js' which is enabled in 'languages.js'"`,
    );
  });
});
