/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  tagline: "A website for testing",
  url: "https://deltice.github.io" /* your github url */,
  baseUrl: "/test-site/" /* base url for your project */,
  projectName: "test-site",
  headerLinks: [
    { doc: "doc1", label: "Docs" },
    { doc: "doc4", label: "API" },
    { page: "help", label: "Help" },
    { blog: true, label: "Blog" }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: "img/docusaurus.svg",
  footerIcon: "img/docusaurus.svg",
  favicon: "img/favicon.png",
  /* colors for website */
  colors: {
    primaryColor: "#2E8555",
    secondaryColor: "#205C3B"
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    "Copyright © " +
    new Date().getFullYear() +
    " Your Name or Your Company Name",
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "default"
  }
};

module.exports = siteConfig;
