/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import logger from '@docusaurus/logger';

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
export default async function getHttpsConfig(): Promise<
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
