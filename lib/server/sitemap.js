/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');

const glob = require('glob');
const CWD = process.cwd();

const sitemap = require('sitemap');

const siteConfig = require(CWD + '/siteConfig.js');

/****************************************************************************/

let readMetadata;
let Metadata;
let MetadataBlog;

readMetadata = require('./readMetadata.js');
readMetadata.generateMetadataDocs();
Metadata = require('../core/metadata.js');
readMetadata.generateMetadataBlog();
MetadataBlog = require('../core/MetadataBlog.js');

/****************************************************************************/

module.exports = function(callback) {
  console.log('sitemap.js triggered...');

  let urls = [];

  let files = glob.sync(CWD + '/pages/en/**/*.js');

  // English-only is the default.
  let enabledLanguages = [
    {
      enabled: true,
      name: 'English',
      tag: 'en',
    },
  ];

  // If we have a languages.js file, get all the enabled languages in there
  if (fs.existsSync(CWD + '/languages.js')) {
    let languages = require(CWD + '/languages.js');
    enabledLanguages = languages.filter(lang => {
      return lang.enabled == true;
    });
  }

  // create a url mapping to all the enabled languages files
  files.map(file => {
    let url = file.split('/pages/en')[1];
    url = siteConfig.cleanUrl
      ? url.replace(/\.js$/, '')
      : url.replace(/\.js$/, '.html');
    let links = enabledLanguages.map(lang => {
      let langUrl = lang.tag + url;
      return {lang: lang.tag, url: langUrl};
    });
    urls.push({url, changefreq: 'weekly', priority: 0.5, links});
  });

  MetadataBlog.map(blog => {
    urls.push({
      url:
        '/blog/' +
        (siteConfig.cleanUrl ? blog.path.replace(/\.html$/, '') : blog.path),
      changefreq: 'weekly',
      priority: 0.3,
    });
  });

  Object.keys(Metadata)
    .filter(key => Metadata[key].language === 'en')
    .map(key => {
      let doc = Metadata[key];
      let links = enabledLanguages.map(lang => {
        let langUrl = doc.permalink.replace('docs/en/', `docs/${lang.tag}/`);
        return {lang: lang.tag, url: langUrl};
      });
      urls.push({
        url: siteConfig.cleanUrl
          ? doc.permalink.replace(/\.html$/, '')
          : doc.permalink,
        changefreq: 'hourly',
        priority: 1.0,
        links,
      });
    });

  const sm = sitemap.createSitemap({
    hostname: siteConfig.url,
    cacheTime: 600 * 1000, // 600 sec - cache purge period
    urls: urls,
  });

  sm.toXML((err, xml) => {
    callback(err, xml);
  });
};
