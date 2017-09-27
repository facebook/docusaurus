/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const Feed = require("feed");

const chalk = require("chalk");
const CWD = process.cwd();

const siteConfig = require(CWD + "/siteConfig.js");

const blogFolder = path.resolve("../blog/");
const blogRootURL = siteConfig.url + "/blog";
const jestImage = siteConfig.url + siteConfig.headerIcon;

/****************************************************************************/

let readMetadata;
let Metadata;

function reloadMetadata() {
  removeFromCache("./readMetadata.js");
  readMetadata = require("./readMetadata.js");
  readMetadata.generateDocsMetadata();
  removeFromCache("../core/metadata.js");
  Metadata = require("../core/metadata.js");
}

/****************************************************************************/

// remove a module and child modules from require cache, so server does not have
// to be restarted
const removeFromCache = moduleName => {
  let mod = require.resolve(moduleName);
  if (mod && (mod = require.cache[mod])) {
    (function traverse(mod) {
      mod.children.forEach(child => {
        traverse(child);
      });
      delete require.cache[mod.id];
    })(mod);
  }

  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};

reloadMetadata();

module.exports = function(type) {
  console.log("feed.js triggered...");

  type = type || "rss";

  removeFromCache(CWD + "/siteConfig.js");
  if (fs.existsSync(__dirname + "/../core/MetadataBlog.js")) {
    removeFromCache("../core/MetadataBlog.js");
    fs.removeSync(__dirname + "/../core/MetadataBlog.js");
  }
  readMetadata.generateBlogMetadata();
  const MetadataBlog = require("../core/MetadataBlog.js");

  const feed = new Feed({
    title: siteConfig.title + " Blog",
    description:
      "The best place to stay up-to-date with the latest " +
      siteConfig.title +
      " news and events.",
    id: blogRootURL,
    link: blogRootURL,
    image: jestImage,
    copyright: siteConfig.copyright,
    updated: new Date(MetadataBlog[0].date)
  });

  MetadataBlog.forEach(post => {
    const url = blogRootURL + "/" + post.path;
    let content = "";
    let contentArr = post.content.split("<!--truncate-->");
    if (contentArr.length > 0) {
      content = contentArr[0];
    }
    content = content.trim().substring(0, 250);

    feed.addItem({
      title: post.title,
      link: url,
      author: [
        {
          name: post.author,
          link: post.authorURL
        }
      ],
      date: new Date(post.date),
      description: content
    });
  });

  return type === "rss" ? feed.rss2() : feed.atom1();
};
