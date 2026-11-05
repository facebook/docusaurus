/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import {pathExists} from '@docusaurus/fs';

export const fixtureSiteDir = path.join(__dirname, '__fixtures__/site');
export const fixtureOutDir = path.join(fixtureSiteDir, 'build');

// Added by test servers when the request handler rejects
export const CrashHeader = 'x-test-crash';

const MaxRedirects = 5;

/**
 * Requests a path and follows its redirects, to describe how it's served:
 * "301 /file → 200 file.html"
 */
export async function describeRequest(
  origin: string,
  requestPath: string,
): Promise<string> {
  const descriptions: string[] = [];

  // Concatenated: new URL('//file', origin) would read "file" as a host name
  let url = origin + requestPath;
  while (descriptions.length <= MaxRedirects) {
    const response = await fetch(url, {redirect: 'manual'});
    descriptions.push(await describeResponse(response));

    const location = response.headers.get('location');
    if (location === null) {
      break;
    }
    url = new URL(location, url).href;
  }

  return descriptions.join(' → ');
}

async function describeResponse(response: Response): Promise<string> {
  const body = await response.text();

  const crashCode = response.headers.get(CrashHeader);
  if (crashCode !== null) {
    return `crash ${crashCode}`;
  }

  const location = response.headers.get('location');
  if (location !== null) {
    return `${response.status} ${location}`;
  }

  const servedFile = (await getServedFixtureFile(body)) ?? response.statusText;
  return `${response.status} ${servedFile}`;
}

// Each fixture build file contains its own path
async function getServedFixtureFile(body: string): Promise<string | undefined> {
  const filePath = body.trim();
  const isFixtureFile =
    filePath !== '' && (await pathExists(path.join(fixtureOutDir, filePath)));
  return isFixtureFile ? filePath : undefined;
}
