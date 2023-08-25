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
    '/feature-requests', // Flaky because of Canny widget
    '/community/canary', // Flaky because of dynamic canary version fetched from npm
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
  console.log('Pathnames:\n', JSON.stringify(pathnames, null, 2));
  console.log('Pathnames before filtering', pathnamesUnfiltered.length);
  console.log('Pathnames after filtering', pathnames.length);
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

function createPathnameTest(pathname: string) {
  test(`pathname ${pathname}`, async ({page}) => {
    const url = siteUrl + pathname;
    await page.goto(url);
    await page.waitForFunction(waitForDocusaurusHydration);
    await page.addStyleTag({content: stylesheet});
    // await expect(page).toHaveScreenshot({ fullPage: true, ...options });
    await argosScreenshot(page, pathnameToArgosName(pathname));
  });
}

test.describe('Docusaurus site screenshots', () => {
  const pathnames = getPathnames();
  pathnames.forEach(createPathnameTest);
});
