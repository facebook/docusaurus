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
const utils = require('../core/utils');

const siteConfig = require(CWD + '/siteConfig.js');

const readMetadata = require('./readMetadata.js');

readMetadata.generateMetadataDocs();
const Metadata = require('../core/metadata.js');

readMetadata.generateMetadataBlog();
const MetadataBlog = require('../core/MetadataBlog.js');

module.exports = function(callback) {
  console.log('sitemap.js triggered...');

  const files = glob.sync(CWD + '/pages/en/**/*.js');

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
    const languages = require(CWD + '/languages.js');
    enabledLanguages = languages.filter(lang => lang.enabled);
  }

  // Create a url mapping to all the enabled languages files
  const urls = files.map(file => {
    let url = file.split('/pages/en')[1];
    url = siteConfig.cleanUrl
      ? url.replace(/\.js$/, '')
      : url.replace(/\.js$/, '.html');
    const links = enabledLanguages.map(lang => {
      const langUrl = lang.tag + url;
      return {lang: lang.tag, url: langUrl};
    });
    return {url, changefreq: 'weekly', priority: 0.5, links};
  });

  MetadataBlog.forEach(blog => {
    urls.push({
      url: '/blog/' + utils.getPath(blog.path, siteConfig.cleanUrl),
      changefreq: 'weekly',
      priority: 0.3,
    });
  });

  Object.keys(Metadata)
    .filter(key => Metadata[key].language === 'en')
    .forEach(key => {
      const doc = Metadata[key];
      const docUrl = utils.getPath(doc.permalink, siteConfig.cleanUrl);
      const links = enabledLanguages.map(lang => {
        const langUrl = docUrl.replace('docs/en/', `docs/${lang.tag}/`);
        return {lang: lang.tag, url: langUrl};
      });
      urls.push({
        url: docUrl,
        changefreq: 'hourly',
        priority: 1.0,
        links,
      });
    });

  const sm = sitemap.createSitemap({
    hostname: siteConfig.url,
    cacheTime: 600 * 1000, // 600 sec - cache purge period
    urls,
  });

  sm.toXML((err, xml) => {
    callback(err, xml);
  });
};
