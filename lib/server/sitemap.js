/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const Feed = require("feed");

const chalk = require("chalk");
const glob = require("glob");
const CWD = process.cwd();

const sitemap = require("sitemap");

const siteConfig = require(CWD + "/siteConfig.js");

const blogFolder = path.resolve("../blog/");
const blogRootURL = siteConfig.url + "/blog";
const jestImage = siteConfig.url + siteConfig.headerIcon;

/****************************************************************************/

let readMetadata;
let Metadata;
let MetadataBlog;

readMetadata = require("./readMetadata.js");
readMetadata.generateMetadataDocs();
Metadata = require("../core/metadata.js");
readMetadata.generateMetadataBlog();
MetadataBlog = require("../core/MetadataBlog.js");

/****************************************************************************/

module.exports = function(callback) {
  console.log("sitemap.js triggered...");

  let urls = [];

  let files = glob.sync(CWD + "/pages/**/*.js");

  // English-only is the default.
  let enabledLanguages = [{
    enabled: true,
    name: "English",
    tag: "en"
  }];

  // If we have a languages.js file, get all the enabled languages in there
  if (fs.existsSync(CWD + "/languages.js")) {
    let languages = require(CWD + "/languages.js");
    enabledLanguages = languages.filter(lang => {
      return lang.enabled == true;
    });
  }

  // create a url mapping to all the enabled languages files
  files.map(file => {
    enabledLanguages.map(lang => {
      let url = file.split("/pages/en")[1];
      let tag = "";
      if (lang.tag != "en") {
        tag = lang.tag;
      }
      url = tag + url;
      url = url.replace(/\.js$/, ".html");
      urls.push({ url: "/" + url, changefreq: "weekly", priority: 0.5 });
    });
  });

  let htmlFiles = glob.sync(CWD + "/pages/**/*.html");

  MetadataBlog.map(blog => {
    urls.push({
      url: "/blog/" + blog.path,
      changefreq: "weekly",
      priority: 0.3
    });
  });

  Object.keys(Metadata).map(key => {
    let doc = Metadata[key];
    urls.push({ url: doc.permalink, changefreq: "hourly", priority: 1.0 });
  });

  const sm = sitemap.createSitemap({
    hostname: siteConfig.url,
    cacheTime: 600 * 1000, // 600 sec - cache purge period
    urls: urls
  });

  sm.toXML((err, xml) => {
    if (err) {
      return "An error has occured.";
    }
    callback(xml);
  });
};
