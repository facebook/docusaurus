/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as fs from 'fs';
import {test} from '@playwright/test';
import {argosScreenshot} from '@argos-ci/playwright';
import * as cheerio from 'cheerio';
import type {Page} from '@playwright/test';

const siteUrl = 'http://localhost:3000';
const sitemapPath = '../website/build/sitemap.xml';
const stylesheetPath = './tests/screenshot.css';

// Use ONLY_PATH="/docs/installation" to debug a specific page
const onlyPath: string | undefined = process.env.ONLY_PATH;

// eslint-disable-next-line no-restricted-properties
const sitemap = fs.readFileSync(sitemapPath).toString();
// eslint-disable-next-line no-restricted-properties
const stylesheet = fs.readFileSync(stylesheetPath).toString();

function extractSitemapUrls() {
  const $ = cheerio.load(sitemap, {xmlMode: true});
  const urls: string[] = [];
  $('loc').each(function handleLoc() {
    urls.push($(this).text());
  });
  return urls;
}

function isBlacklisted(pathname: string) {
  if (onlyPath && onlyPath !== pathname) {
    return true;
  }
  // Some paths explicitly blacklisted
  const BlacklistedPathnames: string[] = [
    // Flaky because of Canny widget
    '/feature-requests',
    // Flaky because of dynamic canary version fetched from npm
    '/community/canary',
    // Flaky because of screenshots being taken dynamically
    '/showcase',
    // Long blog post with many image carousels, often timeouts
    '/blog/2022/08/01/announcing-docusaurus-2.0',
  ];

  return (
    // changelog docs
    pathname.startsWith('/changelog') ||
    // versioned docs
    pathname.match(/^\/docs\/((\d\.\d\.\d)|(next))\//) ||
    // manually excluded urls
    BlacklistedPathnames.includes(pathname)
  );
}

function getPathnames(): string[] {
  const urls = extractSitemapUrls();
  const pathnamesUnfiltered = urls.map((url) => new URL(url).pathname);
  const pathnames = pathnamesUnfiltered.filter(
    (pathname) => !isBlacklisted(pathname),
  );
  pathnames.sort();
  /*
  console.log('Pathnames:\n', JSON.stringify(pathnames, null, 2));
  console.log('Pathnames before filtering', pathnamesUnfiltered.length);
  console.log('Pathnames after filtering', pathnames.length);

   */
  return pathnames;
}

function pathnameToArgosName(pathname: string): string {
  function removeTrailingSlash(str: string): string {
    return str.endsWith('/') ? str.slice(0, -1) : str;
  }
  function removeLeadingSlash(str: string): string {
    return str.startsWith('/') ? str.slice(1) : str;
  }

  pathname = removeTrailingSlash(pathname);
  pathname = removeLeadingSlash(pathname);

  if (pathname === '') {
    return 'index';
  }

  return pathname;
}

// See https://github.com/facebook/docusaurus/pull/9256
// Docusaurus adds a <html data-has-hydrated="true">
function waitForDocusaurusHydration() {
  return document.documentElement.dataset.hasHydrated === 'true';
}

// Ensure that Docusaurus site pages do not emit unexpected errors/warnings
// See https://github.com/microsoft/playwright/issues/27277
// TODO this shouldn't be the responsibility of Argos tests to do this
//  but this is convenient to do this here for now
function throwOnConsole(page: Page) {
  const typesToCheck = ['error', 'warning'];

  const ignoreMessages = [
    // This mismatch warning looks like a React 18 bug to me
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s className "null" ""',

    // TODO this fetch error message is unexpected and should be fixed
    //  it's already happening in main branch
    'Failed to load resource: the server responded with a status of 404 (Not Found)',

    // TODO looks like a legit hydration bug to fix
    // on /blog/releases/2.4
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs" "/docs?docusaurus-theme=light"',
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs" "/docs?docusaurus-theme=dark"',
    // on /blog/releases/3.0
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs" "/docs?docusaurus-data-navbar=false&docusaurus-data-red-border"',
    // on /docs/styling-layout
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs" "/docs?docusaurus-data-navbar=false&docusaurus-data-red-border"',
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs/configuration" "/docs/configuration?docusaurus-theme=light"',
    'Warning: Prop `%s` did not match. Server: %s Client: %s%s href "/docs/configuration" "/docs/configuration?docusaurus-theme=dark"',

    // TODO weird problem related to KaTeX fonts refusing to decode?
    //  on /docs/markdown-features/math-equations
    'Failed to decode downloaded font: http://localhost:3000/katex/fonts/',
    'OTS parsing error: Failed to convert WOFF 2.0 font to SFNT',
  ];

  page.on('console', (message) => {
    if (!typesToCheck.includes(message.type())) {
      return;
    }
    if (ignoreMessages.some((msg) => message.text().includes(msg))) {
      return;
    }
    throw new Error(`Docusaurus site page unexpectedly logged something to the browser console
Type=${message.type()}
Text=${message.text()}
Location=${message.location().url}`);
  });
}

function createPathnameTest(pathname: string) {
  test(`pathname ${pathname}`, async ({page}) => {
    throwOnConsole(page);
    const url = siteUrl + pathname;
    await page.goto(url);
    await page.waitForFunction(waitForDocusaurusHydration);
    await page.addStyleTag({content: stylesheet});
    // await expect(page).toHaveScreenshot({ fullPage: true, ...options });
    await argosScreenshot(page, pathnameToArgosName(pathname));
  });
}

// Allow parallel execution within a single test file
// See https://playwright.dev/docs/test-parallel
test.describe.configure({mode: 'parallel'});

test.describe('Docusaurus site screenshots', () => {
  const pathnames = getPathnames();
  pathnames.forEach(createPathnameTest);
});
