/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO Legacy CRA react-dev-utils package code
//  This code was in CRA/react-dev-utils (deprecated in 2025)
//  We just copied the code as-is to remove a fat/useless dependency subtree
//  See https://github.com/facebook/docusaurus/pull/10956
//  See https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js

/* eslint-disable */

import {execSync} from 'child_process';
import open from 'open';

type BrowserName = string | undefined;
type BrowserArgs = string[];

// Copied from https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js
const BrowserEnv: BrowserName = process.env.DOCUSAURUS_BROWSER;
const BrowserEnvArgs: string[] = process.env.DOCUSAURUS_BROWSER_ARGS
  ? process.env.DOCUSAURUS_BROWSER_ARGS.split(' ')
  : [];

function startBrowserProcess(
  url: string,
  browser: BrowserName,
  args: BrowserArgs,
) {
  console.log('startBrowserProcess', {url, browser, args});

  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // Chrome with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const shouldTryOpenChromiumWithAppleScript =
    process.platform === 'darwin' &&
    (typeof browser !== 'string' || browser === 'google chrome');

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
        execSync('ps cax | grep "' + chromiumBrowser + '"');
        execSync(
          'osascript openChrome.applescript "' +
            encodeURI(url) +
            '" "' +
            chromiumBrowser +
            '"',
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

  // If there are arguments, they must be passed as array with the browser
  if (typeof browser === 'string' && args.length > 0) {
    // @ts-expect-error: TODO fix this
    browser = [browser].concat(args);
  }

  // Fallback to open
  // (It will always open new tab)
  try {
    // @ts-expect-error: TODO fix this
    const options: open.Options = {app: browser, wait: false, url: true};
    // console.log('OPEN', url, options);
    open(url, options).catch(() => {}); // Prevent `unhandledRejection` error.
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Reads the BROWSER environment variable and decides what to do with it. Returns
 * true if it opened a browser or ran a node.js script, otherwise false.
 */
export default function openBrowser(url: string): boolean {
  // Special case: BROWSER="none" will prevent opening completely.
  if (BrowserEnv === 'none') {
    return false;
  }
  return startBrowserProcess(url, BrowserEnv, BrowserEnvArgs);
}
