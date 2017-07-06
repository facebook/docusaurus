/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const fs = require("fs");

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: "User1",
    image: "/test-site/img/docusaurus.svg",
    infoLink: "https://www.example.com",
    pinned: true
  }
];

const siteConfig = {
  title: "Test Site" /* title for your website */,
  url: "https://deltice.github.io" /* your github url */,
  baseUrl: "/test-site/" /* base url for your project */,
  projectName: "test-site",
  repo: "deltice/test-site" /* repo for your project */,
  users,
  /* base url for editing docs, usage example: editUrl + 'en/doc1.md' */
  editUrl: "https://github.com/deltice/test-site/edit/master/docs/",
  /* header links for links on this site, 'LANGUAGE' will be replaced by whatever
     language the page is for, ex: 'en' */
  headerLinksInternal: [
    {
      section: "docs",
      href: "/test-site/docs/LANGUAGE/doc1.html",
      text: "Docs"
    },
    { section: "api", href: "/test-site/docs/LANGUAGE/doc4.html", text: "API" },
    { section: "help", href: "/test-site/LANGUAGE/help.html", text: "Help" },
    { section: "blog", href: "/test-site/blog", text: "Blog" }
  ],
  /* header links for links outside the site */
  headerLinksExternal: [
    {
      section: "github",
      href: "https://github.com/deltice/test-site",
      text: "GitHub"
    }
  ],
  /* path to images for header/footer */
  headerIcon: "img/docusaurus.svg",
  footerIcon: "img/docusaurus.svg",
  favicon: "img/favicon.png",
  /* default link for docsSidebar */
  docsSidebarDefaults: {
    layout: "docs",
    root: "/test-site/docs/en/doc1.html",
    title: "Docs"
  },
  /* colors for website */
  colors: {
    primaryColor: "#2E8555",
    secondaryColor: "#205C3B",
    prismColor:
      "rgba(46, 133, 85, 0.03)" /* primaryColor in rgba form, with 0.03 alpha */
  },
  tagline: "My Tagline",
  recruitingLink: "https://crowdin.com/project/test-site" /* translation site "help translate" link */,
  /* remove this section to disable search bar */
  algolia: {
    apiKey: "0f9f28b9ab9efae89810921a351753b5", /* use your search-only api key */
    indexName: "github"
  },
  /* remove this to disable google analytics tracking */
  /* gaTrackingId: "" */
};

let languages;
if (fs.existsSync("./languages.js")) {
  languages = require("./languages.js");
  siteConfig["en"] = require("./i18n/en.json");
} else {
  languages = [
    {
      enabled: true,
      name: "English",
      tag: "en"
    }
  ];
}

const enabledLanguages = languages.filter(lang => lang.enabled);

siteConfig["languages"] = enabledLanguages;

/* INJECT LOCALIZED FILES BEGIN */
/* INJECT LOCALIZED FILES END */

module.exports = siteConfig;
