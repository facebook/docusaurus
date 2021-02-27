/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import {ConfigAPI, TransformOptions} from '@babel/core';

function getTransformOptions(isServer: boolean): TransformOptions {
  const absoluteRuntimePath = path.dirname(
    require.resolve(`@babel/runtime/package.json`),
  );
  return {
    // All optional newlines and whitespace will be omitted when generating code in compact mode
    compact: true,
    presets: [
      isServer
        ? [
            require.resolve('@babel/preset-env'),
            {
              targets: {
                node: 'current',
              },
            },
          ]
        : [
            require.resolve('@babel/preset-env'),
            {
              useBuiltIns: 'entry',
              loose: true,
              corejs: '3',
              // Do not transform modules to CJS
              modules: false,
              // Exclude transforms that make all code slower
              exclude: ['transform-typeof-symbol'],
            },
          ],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: true,
          // By default, it assumes @babel/runtime@7.0.0. Since we use >7.0.0, better to
          // explicitly specify the version so that it can reuse the helper better
          // See https://github.com/babel/babel/issues/10261
          // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
          useESModules: true,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
      // Adds syntax support for import()
      isServer
        ? require.resolve('babel-plugin-dynamic-import-node')
        : require.resolve('@babel/plugin-syntax-dynamic-import'),
      // Optional chaining and nullish coalescing are supported in @babel/preset-env,
      // but not yet supported in webpack due to support missing from acorn.
      // These can be removed once we bumped to webpack 5.
      // See https://github.com/facebook/docusaurus/issues/2908
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    ],
  };
}

function babelPresets(api: ConfigAPI): TransformOptions {
  const callerName = api.caller((caller) => caller?.name);
  return getTransformOptions(callerName === 'server');
}

export default babelPresets;
