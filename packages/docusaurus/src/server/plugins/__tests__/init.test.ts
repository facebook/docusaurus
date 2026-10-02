/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import path from 'node:path';
import {mkdtempDisposable, realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import fs from 'fs-extra';

import {loadContext, type LoadContextParams} from '../../site';
import {initPlugins} from '../init';

async function loadSite(
  fixtureName: string,
  options: Omit<LoadContextParams, 'siteDir'> = {},
) {
  const siteDir = path.join(__dirname, '__fixtures__', fixtureName);
  const context = await loadContext({...options, siteDir});
  const plugins = await initPlugins(context);

  return {siteDir, context, plugins};
}

describe('initPlugins', () => {
  it('parses plugins correctly and loads them in correct order', async () => {
    const {context, plugins} = await loadSite('site-with-plugin');
    expect(context.siteConfig.plugins).toHaveLength(7);
    expect(plugins).toHaveLength(10);

    expect(plugins[0]!.name).toBe('preset-plugin1');
    expect(plugins[1]!.name).toBe('preset-plugin2');
    expect(plugins[2]!.name).toBe('preset-theme1');
    expect(plugins[3]!.name).toBe('preset-theme2');
    expect(plugins[4]!.name).toBe('first-plugin');
    expect(plugins[5]!.name).toBe('second-plugin');
    expect(plugins[6]!.name).toBe('third-plugin');
    expect(plugins[7]!.name).toBe('fourth-plugin');
    expect(context.siteConfig.themeConfig).toEqual({
      a: 1,
      esmPlugin: {
        joi: true,
      },
      tsPlugin: {
        joi: true,
      },
    });
  });

  it('throws user-friendly error message for plugins with bad values', async () => {
    await expect(() =>
      loadSite('site-with-plugin', {config: 'badPlugins.docusaurus.config.js'}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error:  => Bad Docusaurus plugin value plugins[0].
      Example valid plugin config:
      {
        plugins: [
          ["@docusaurus/plugin-content-docs",options],
          "./myPlugin",
          ["./myPlugin",{someOption: 42}],
          function myPlugin() { },
          [function myPlugin() { },options]
        ],
      };

       => Bad Docusaurus plugin value plugins[1].
      Example valid plugin config:
      {
        plugins: [
          ["@docusaurus/plugin-content-docs",options],
          "./myPlugin",
          ["./myPlugin",{someOption: 42}],
          function myPlugin() { },
          [function myPlugin() { },options]
        ],
      };

      ]
    `);
  });

  it('throws user-friendly error message for plugins with no name', async () => {
    await expect(() => loadSite('site-with-unnamed-plugin')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      [Error: A Docusaurus plugin is missing a 'name' property.
      Note that even inline/anonymous plugin functions require a 'name' property.]
    `);
  });

  it('throws user-friendly error message for plugins returning undefined', async () => {
    await expect(() => loadSite('site-with-undefined-plugin')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      [Error: A Docusaurus plugin returned 'undefined', which is forbidden.
      A plugin is expected to return an object having at least a 'name' property.
      If you want a plugin to self-disable depending on context/options, you can explicitly return 'null' instead of 'undefined']
    `);
  });
});

// Plugins/themes/presets are resolved with require.resolve() from the site
// config, and then loaded with loadFreshModule()
// See plugins/configs.ts and plugins/presets.ts
describe('initPlugins module loading', () => {
  // A CJS package compiled by tsc, like all our own plugins
  function tscPackage(name: string, body: string) {
    return {
      [`node_modules/${name}/package.json`]: JSON.stringify({
        name,
        version: '1.0.0',
        main: 'lib/index.js',
      }),
      [`node_modules/${name}/lib/index.js`]: [
        `"use strict";`,
        `Object.defineProperty(exports, "__esModule", { value: true });`,
        body,
      ].join('\n'),
    };
  }

  const siteFiles = {
    'docusaurus.config.ts': `
      import type {Config} from '@docusaurus/types';
      export default {
        title: 'Site',
        url: 'https://example.com',
        baseUrl: '/',
        themeConfig: {},
        presets: ['./preset.ts', ['npm-preset', {presetOption: 42}]],
        themes: ['npm-theme'],
        plugins: [
          './plugins/cjs-dir',
          './plugins/esm-file.js',
          ['./plugins/ts-dir/index.ts', {tsOption: 42}],
          ['tsc-compiled', {tscOption: 42}],
          '@my-scope/esm-only',
          'workspace-ts',
        ],
      } satisfies Config as Config;
    `,
    'preset.ts': `
      export default function preset() {
        return {plugins: [() => ({name: 'local-preset-plugin'})]};
      }
    `,
    'plugins/cjs-dir/index.js': `
      module.exports = function () { return {name: 'cjs-dir'}; };
    `,
    'plugins/esm-file.js': `
      export default function () { return {name: 'esm-file'}; }
      export function validateOptions({options}) {
        return {...options, id: 'esm-file-id'};
      }
    `,
    'plugins/ts-dir/index.ts': `
      import type {LoadContext} from '@docusaurus/types';
      export default function (_context: LoadContext, options: object) {
        return {name: 'ts-dir', options};
      }
      export function validateOptions({options}: {options: object}) {
        return {...options, id: 'ts-dir-id'};
      }
    `,
    ...tscPackage(
      'npm-preset',
      `exports.default = function (context, options) {
        return {plugins: [() => ({name: 'npm-preset-plugin-' + options.presetOption})]};
      };`,
    ),
    ...tscPackage(
      'docusaurus-theme-npm-theme',
      `exports.default = function () { return {name: 'npm-theme'}; };
      exports.validateThemeConfig = function ({themeConfig}) {
        return {...themeConfig, npmTheme: 'validated'};
      };`,
    ),
    ...tscPackage(
      '@docusaurus/plugin-tsc-compiled',
      `exports.default = function () { return {name: 'tsc-compiled'}; };
      exports.validateOptions = function ({options}) {
        return {...options, id: 'tsc-compiled-id'};
      };`,
    ),
    'node_modules/@my-scope/docusaurus-plugin-esm-only/package.json':
      JSON.stringify({
        name: '@my-scope/docusaurus-plugin-esm-only',
        version: '1.0.0',
        type: 'module',
        exports: './index.js',
      }),
    'node_modules/@my-scope/docusaurus-plugin-esm-only/index.js': `
      export default function () { return {name: 'esm-only'}; }
    `,
    // Symlinked to node_modules, like pnpm/yarn workspace packages
    '../packages/workspace-ts/package.json': JSON.stringify({
      name: 'docusaurus-plugin-workspace-ts',
      version: '1.0.0',
      main: 'src/index.ts',
    }),
    '../packages/workspace-ts/src/index.ts': `
      export default function (): {name: string} {
        return {name: 'workspace-ts'};
      }
    `,
  };

  it('loads local and npm plugins, themes and presets', async () => {
    await using tmpDir = await mkdtempDisposable(
      path.join(await realpath(tmpdir()), 'docusaurus-init-plugins-'),
    );
    const siteDir = path.join(tmpDir.path, 'website');
    await Promise.all(
      Object.entries(siteFiles).map(([file, content]) =>
        fs.outputFile(path.join(siteDir, file), content),
      ),
    );
    await fs.ensureDir(path.join(siteDir, 'node_modules'));
    await fs.symlink(
      path.join(tmpDir.path, 'packages/workspace-ts'),
      path.join(siteDir, 'node_modules/docusaurus-plugin-workspace-ts'),
      'junction',
    );

    const context = await loadContext({siteDir});
    const plugins = await initPlugins(context);

    expect(
      plugins.map((plugin) => ({
        name: plugin.name,
        id: plugin.options.id,
        type: plugin.version.type,
      })),
    ).toEqual([
      {name: 'local-preset-plugin', id: 'default', type: 'local'},
      {name: 'npm-preset-plugin-42', id: 'default', type: 'local'},
      {name: 'cjs-dir', id: 'default', type: 'local'},
      {name: 'esm-file', id: 'esm-file-id', type: 'local'},
      {name: 'ts-dir', id: 'ts-dir-id', type: 'local'},
      {name: 'tsc-compiled', id: 'tsc-compiled-id', type: 'package'},
      {name: 'esm-only', id: 'default', type: 'package'},
      {name: 'workspace-ts', id: 'default', type: 'package'},
      {name: 'npm-theme', id: 'default', type: 'package'},
    ]);
    expect(plugins.find((p) => p.name === 'ts-dir')!.options).toEqual({
      id: 'ts-dir-id',
      tsOption: 42,
    });
    expect(context.siteConfig.themeConfig).toEqual({npmTheme: 'validated'});
  });
});
