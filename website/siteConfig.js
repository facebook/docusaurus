/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: "Prettier",
    image: "/docusaurus/img/prettier.png",
    infoLink: "https://www.prettier.io",
    pinned: true
  }
];

const siteConfig = {
  title: "Docusaurus",
  tagline: "Open Source Documentation Websites",
  url: "https://facebookexperimental.github.io",
  baseUrl: "/docusaurus/",
  projectName: "docusaurus",
  users,
  editUrl:
    "https://github.com/facebookexperimental/docusaurus/edit/master/docs/",
  headerLinksInternal: [
    {
      section: "docs",
      href: "/docusaurus/docs/getting-started.html",
      text: "Docs"
    },
    { section: "help", href: "/docusaurus/LANGUAGE/help.html", text: "Help" }
  ],
  headerLinksExternal: [
    {
      section: "github",
      href: "https://github.com/facebookexperimental/docusaurus",
      text: "GitHub"
    }
  ],
  headerIcon: "img/docusaurus.svg",
  footerIcon: "img/docusaurus.svg",
  favicon: "img/favicon.png",
  colors: {
    primaryColor: "#2E8555",
    secondaryColor: "#205C3B",
    prismColor:
      "rgba(46, 133, 85, 0.03)"
  }
};

module.exports = siteConfig;
