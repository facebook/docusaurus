/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This code was initially in CRA/react-dev-utils (deprecated in 2025)
// We copied and refactored it
// See https://github.com/facebook/docusaurus/pull/10956
// See https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js

/* eslint-disable */

import {execSync} from 'child_process';
import open from 'open';

type BrowserName = string | undefined;
type BrowserArgs = string[];

type Params = {
  url: string;
  browser: BrowserName;
  browserArgs: BrowserArgs;
};

// Not sure if we need this, but let's keep a secret escape hatch
// CRA/react-dev-utils supported BROWSER/BROWSER_ARGS
const BrowserEnv: BrowserName = process.env.DOCUSAURUS_BROWSER;
const BrowserEnvArgs: string[] = process.env.DOCUSAURUS_BROWSER_ARGS
  ? process.env.DOCUSAURUS_BROWSER_ARGS.split(' ')
  : [];

// If we're on OS X, the user hasn't specifically
// requested a different browser, we can try opening
// Chrome with AppleScript. This lets us reuse an
// existing tab when possible instead of creating a new one.
// Copied from https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js
async function tryOpenWithAppleScript({
  url,
  browser,
}: Params): Promise<boolean> {
  const shouldTryOpenChromiumWithAppleScript =
    process.platform === 'darwin' &&
    (typeof browser !== 'string' || browser === 'google chrome');

  if (!shouldTryOpenChromiumWithAppleScript) {
    return false;
  }

  if (shouldTryOpenChromiumWithAppleScript) {
    // Will use the first open browser found from list
    const supportedChromiumBrowsers = [
      'Google Chrome Canary',
      'Google Chrome Dev',
      'Google Chrome Beta',
      'Google Chrome',
      'Microsoft Edge',
      'Brave Browser',
      'Vivaldi',
      'Chromium',
    ];

    for (let chromiumBrowser of supportedChromiumBrowsers) {
      try {
        // Try our best to reuse existing tab
        // on OSX Chromium-based browser with AppleScript
        execSync(`ps cax | grep "${chromiumBrowser}"`);
        execSync(
          `osascript openChrome.applescript "${encodeURI(
            url,
          )}" "${chromiumBrowser}"`,
          {
            cwd: __dirname,
            stdio: 'ignore',
          },
        );
        return true;
      } catch (err) {
        // Ignore errors.
      }
    }
  }
  return false;
}

function toOpenApp(params: Params): open.App | undefined {
  if (!params.browser) {
    return undefined;
  }
  // Handles "cross-platform" shortcuts like "chrome", "firefox", "edge"
  if (open.apps[params.browser as open.AppName]) {
    return {
      name: open.apps[params.browser as open.AppName],
      arguments: params.browserArgs,
    };
  }
  // Fallback to platform-specific app name
  return {
    name: params.browser,
    arguments: params.browserArgs,
  };
}

async function startBrowserProcess(params: Params): Promise<boolean> {
  if (await tryOpenWithAppleScript(params)) {
    return true;
  }
  try {
    await open(params.url, {
      app: toOpenApp(params),
      wait: false,
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Returns true if it opened a browser
 */
export default async function openBrowser(url: string): Promise<boolean> {
  return startBrowserProcess({
    url,
    browser: BrowserEnv,
    browserArgs: BrowserEnvArgs,
  });
}
