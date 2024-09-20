/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import {getCSSExtractPlugin} from '@docusaurus/bundler';
import logger from '@docusaurus/logger';
import type {ConfigureWebpackUtils, CurrentBundler} from '@docusaurus/types';

export async function createStyleLoadersFactory({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<ConfigureWebpackUtils['getStyleLoaders']> {
  const CssExtractPlugin = await getCSSExtractPlugin({currentBundler});

  return function getStyleLoaders(
    isServer: boolean,
    cssOptionsArg: {
      [key: string]: unknown;
    } = {},
  ) {
    const cssOptions: {[key: string]: unknown} = {
      // TODO turn esModule on later, see https://github.com/facebook/docusaurus/pull/6424
      esModule: false,
      ...cssOptionsArg,
    };

    // On the server we don't really need to extract/emit CSS
    // We only need to transform CSS module imports to a styles object
    if (isServer) {
      return cssOptions.modules
        ? [
            {
              loader: require.resolve('css-loader'),
              options: cssOptions,
            },
          ]
        : // Ignore regular CSS files
          [{loader: require.resolve('null-loader')}];
    }

    return [
      {
        loader: CssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },

      // TODO apart for configurePostCss(), do we really need this loader?
      // Note: using postcss here looks inefficient/duplicate
      // But in practice, it's not a big deal because css-loader also uses postcss
      // and is able to reuse the parsed AST from postcss-loader
      // See https://github.com/webpack-contrib/css-loader/blob/master/src/index.js#L159
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: [
              // eslint-disable-next-line global-require
              require('autoprefixer'),
            ],
          },
        },
      },
    ];
  };
}

// Ensure the certificate and key provided are valid and if not
// throw an easy to debug error
function validateKeyAndCerts({
  cert,
  key,
  keyFile,
  crtFile,
}: {
  cert: Buffer;
  key: Buffer;
  keyFile: string;
  crtFile: string;
}) {
  let encrypted: Buffer;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    logger.error`The certificate path=${crtFile} is invalid.`;
    throw err;
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    logger.error`The certificate key path=${keyFile} is invalid.`;
    throw err;
  }
}

// Read file and throw an error if it doesn't exist
async function readEnvFile(file: string, type: string) {
  if (!(await fs.pathExists(file))) {
    throw new Error(
      `You specified ${type} in your env, but the file "${file}" can't be found.`,
    );
  }
  return fs.readFile(file);
}

// Get the https config
// Return cert files if provided in env, otherwise just true or false
export async function getHttpsConfig(): Promise<
  boolean | {cert: Buffer; key: Buffer}
> {
  const appDirectory = await fs.realpath(process.cwd());
  const {SSL_CRT_FILE, SSL_KEY_FILE, HTTPS} = process.env;
  const isHttps = HTTPS === 'true';

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile = path.resolve(appDirectory, SSL_CRT_FILE);
    const keyFile = path.resolve(appDirectory, SSL_KEY_FILE);
    const config = {
      cert: await readEnvFile(crtFile, 'SSL_CRT_FILE'),
      key: await readEnvFile(keyFile, 'SSL_KEY_FILE'),
    };

    validateKeyAndCerts({...config, keyFile, crtFile});
    return config;
  }
  return isHttps;
}
