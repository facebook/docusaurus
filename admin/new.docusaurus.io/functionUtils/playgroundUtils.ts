/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {HandlerEvent, HandlerResponse} from '@netlify/functions';

const CookieName = 'DocusaurusPlaygroundName';

const PlaygroundConfigs = {
  codesandbox: 'https://codesandbox.io/s/docusaurus',

  // stackblitz: 'https://stackblitz.com/fork/docusaurus', // not updated
  // stackblitz: 'https://stackblitz.com/github/facebook/docusaurus/tree/main/examples/classic', // slow to load
  stackblitz: 'https://stackblitz.com/github/facebook/docusaurus/tree/starter', // dedicated branch: faster load
};

const PlaygroundDocumentationUrl = 'https://docusaurus.io/docs/playground';

export type PlaygroundName = keyof typeof PlaygroundConfigs;

function isValidPlaygroundName(
  playgroundName: string,
): playgroundName is PlaygroundName {
  return Object.keys(PlaygroundConfigs).includes(playgroundName);
}

export function createPlaygroundDocumentationResponse(): HandlerResponse {
  return {
    statusCode: 302,
    headers: {
      Location: PlaygroundDocumentationUrl,
    },
  };
}

export function createPlaygroundResponse(
  playgroundName: PlaygroundName,
): HandlerResponse {
  const playgroundUrl = PlaygroundConfigs[playgroundName];
  return {
    statusCode: 302,
    headers: {
      Location: playgroundUrl,
      'Set-Cookie': `${CookieName}=${playgroundName}`,
    },
  };
}

// Inspired by https://stackoverflow.com/a/3409200/82609
function parseCookieString(cookieString: string): Record<string, string> {
  const result: Record<string, string> = {};
  cookieString.split(';').forEach(function (cookie) {
    const [name, value] = cookie.split('=');
    result[name.trim()] = decodeURI(value);
  });
  return result;
}

export function readPlaygroundName(
  event: HandlerEvent,
): PlaygroundName | undefined {
  const parsedCookie: Record<string, string> = event.headers.cookie
    ? parseCookieString(event.headers.cookie)
    : {};
  const playgroundName: string | undefined = parsedCookie[CookieName];

  if (playgroundName) {
    if (isValidPlaygroundName(playgroundName)) {
      return playgroundName;
    } else {
      console.error(
        `playgroundName found in cookie was invalid: ${playgroundName}`,
      );
    }
  }
  return undefined;
}
