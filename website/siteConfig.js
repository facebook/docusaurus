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
    image: "/img/prettier.png",
    infoLink: "https://www.prettier.io",
    pinned: true
  },
  {
    caption: "FastText",
    image: "/img/fasttext.png",
    infoLink: "https://fasttext.cc",
    pinned: true
  },
  {
    caption: "Docusaurus",
    image: "/img/docusaurus.svg",
    infoLink: "https://www.docusaurus.io",
    pinned: true
  }
];

const siteConfig = {
  title: "Docusaurus",
  tagline: "Open Source Documentation Websites",
  url: "https://docusaurus.io",
  baseUrl: "/",
  projectName: "docusaurus",
  cname: "docusaurus.io"
  users,
  editUrl:
    "https://github.com/facebookexperimental/docusaurus/edit/master/docs/",
  headerLinks: [
    { doc: "installation", label: "Docs" },
    { page: "help", label: "Help" },
    {
      href: "https://github.com/facebookexperimental/docusaurus",
      label: "GitHub"
    }
  ],
  headerIcon: "img/docusaurus.svg",
  footerIcon: "img/docusaurus_monochrome.svg",
  favicon: "img/favicon.png",
  // See https://docusaurus.io/docs/search for more information about Aloglia
  // search
  /*
  algolia: {
    apiKey: "my-search-only-api-key-1234",
    indexName: "my-index-name"
  },
  */
  colors: {
    primaryColor: "#2E8555",
    secondaryColor: "#205C3B",
    prismColor: "rgba(46, 133, 85, 0.03)"
  }
};

module.exports = siteConfig;
