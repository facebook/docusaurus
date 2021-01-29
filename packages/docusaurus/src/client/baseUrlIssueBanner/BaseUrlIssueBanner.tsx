/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useLayoutEffect} from 'react';
import {useLocation} from 'react-router-dom';

import Head from '../exports/Head';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// The critical CSS will hide the banner if it loads successfully!
import './styles.module.css';

const BannerContainerId = 'docusaurus-base-url-issue-banner-container';

const SuggestionContainerId =
  'docusaurus-base-url-issue-banner-suggestion-container';

// It is important to not use React to render this banner
// otherwise Google would index it, even if it's hidden with some critical CSS!
// See https://github.com/facebook/docusaurus/issues/4028
// - We can't SSR (or it would be indexed)
// - We can't CSR (as it means the baseurl is correct)
function createInlineHtmlBanner(baseUrl: string) {
  return `
<div style="border: thick solid red; background-color: rgb(255, 230, 179); margin: 20px; padding: 20px; font-size: 20px;">
   <p style="font-weight: bold; font-size: 30px;">Your Docusaurus site did not load properly.</p>
   <p>A very common reason is a wrong site <a href="https://v2.docusaurus.io/docs/docusaurus.config.js/#baseurl" style="font-weight: bold;">baseUrl configuration</a>.</p>
   <p>Current configured baseUrl = <span style="font-weight: bold; color: red;">${baseUrl}</span> ${
    baseUrl === '/' ? ' (default value)' : ''
  }</p>
   <p>We suggest trying baseUrl = <span id="${SuggestionContainerId}" style="font-weight: bold; color: green;"></span></p>
</div>
`;
}

// fn needs to work for older browsers!
function createInlineScript(baseUrl: string) {
  return `
function renderBanner() {
  var banner = document.getElementById('${BannerContainerId}');
  if (!banner) {
    return;
  }
  var bannerHtml = ${JSON.stringify(createInlineHtmlBanner(baseUrl))
    // See https://redux.js.org/recipes/server-rendering/#security-considerations
    .replace(/</g, '\\\u003c')};
  banner.innerHTML = bannerHtml;

  var suggestionContainer = document.getElementById('${SuggestionContainerId}');
  var actualHomePagePath = window.location.pathname;
  var suggestedBaseUrl = actualHomePagePath.substr(-1) === '/'
        ? actualHomePagePath
        : actualHomePagePath + '/';
  suggestionContainer.innerHTML = suggestedBaseUrl;
}

document.addEventListener('DOMContentLoaded', renderBanner);
`;
}

// Normally if the baseUrl is correct, the banner will already be hidden by the critical CSS
// But we can still remove it totally from the DOM if it's not useful anymore
// This is kind of a "double security"
// It can also prevent the banner to appear if the CSS fails to load due to some network error
function useBannerRemover() {
  useLayoutEffect(() => {
    const banner = document.getElementById(BannerContainerId);
    if (banner) {
      banner.remove();
    }
  }, []);
}

function BaseUrlIssueBannerEnabled() {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  return (
    <>
      <Head>
        <script>{createInlineScript(baseUrl)}</script>
      </Head>
      <div id={BannerContainerId} />
    </>
  );
}

// We want to help the users with a bad baseUrl configuration (very common error)
// Help message is inlined, and hides if the external CSS is able to load successfully
// Note: it might create false positives (ie network failures): not a big deal
// Note: we only inline this for the homepage to avoid polluting all the site's pages
// See https://github.com/facebook/docusaurus/pull/3621
export default function BaseUrlIssueBanner(): JSX.Element | null {
  const {
    siteConfig: {baseUrl, baseUrlIssueBanner},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  useBannerRemover();

  // returns true for the homepage during SRR
  const isHomePage = pathname === baseUrl;

  const enabled = baseUrlIssueBanner && isHomePage;

  return enabled ? <BaseUrlIssueBannerEnabled /> : null;
}
