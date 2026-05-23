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
// throw an easy to debug error.
//
// Works for any key type (RSA, ECDSA, EdDSA, ...) — parses both PEMs and
// checks that the public key embedded in the cert matches the public key
// derived from the private key.
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
  let certPublicKey: crypto.KeyObject;
  try {
    certPublicKey = new crypto.X509Certificate(cert).publicKey;
  } catch (err) {
    logger.error`The certificate path=${crtFile} is invalid.`;
    throw err;
  }

  let keyPublicKey: crypto.KeyObject;
  try {
    keyPublicKey = crypto.createPublicKey(crypto.createPrivateKey(key));
  } catch (err) {
    logger.error`The certificate key path=${keyFile} is invalid.`;
    throw err;
  }

  if (!certPublicKey.equals(keyPublicKey)) {
    throw new Error(
      logger.interpolate`The certificate path=${crtFile} and key path=${keyFile} do not match.`,
    );
  }
}

// Read file and throw an error if it doesn't exist
async function readEnvFile(file: string, source: string) {
  if (!(await fs.pathExists(file))) {
    throw new Error(
      `You specified ${source}, but the file "${file}" can't be found.`,
    );
  }
  return fs.readFile(file);
}

export type GetHttpsConfigOptions = {
  https?: boolean;
  sslCert?: string;
  sslKey?: string;
};

// Get the https config
// Return cert files if provided via CLI or env, otherwise just true or false.
// CLI options take precedence over env vars.
export default async function getHttpsConfig(
  options: GetHttpsConfigOptions = {},
): Promise<boolean | {cert: Buffer; key: Buffer}> {
  const appDirectory = await fs.realpath(process.cwd());
  const {SSL_CRT_FILE, SSL_KEY_FILE, HTTPS} = process.env;

  const crtFromCli = Boolean(options.sslCert);
  const keyFromCli = Boolean(options.sslKey);
  const crtRaw = options.sslCert ?? SSL_CRT_FILE;
  const keyRaw = options.sslKey ?? SSL_KEY_FILE;

  // Providing both --ssl-cert and --ssl-key implies HTTPS.
  const isHttps =
    options.https === true ||
    HTTPS === 'true' ||
    (crtFromCli && keyFromCli);

  if (isHttps && crtRaw && keyRaw) {
    const crtFile = path.resolve(appDirectory, crtRaw);
    const keyFile = path.resolve(appDirectory, keyRaw);
    const config = {
      cert: await readEnvFile(
        crtFile,
        crtFromCli ? '--ssl-cert' : 'SSL_CRT_FILE in your env',
      ),
      key: await readEnvFile(
        keyFile,
        keyFromCli ? '--ssl-key' : 'SSL_KEY_FILE in your env',
      ),
    };

    validateKeyAndCerts({...config, keyFile, crtFile});
    return config;
  }
  return isHttps;
}
