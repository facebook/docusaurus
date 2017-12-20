/**

 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function execute(port) {
  const extractTranslations = require('../write-translations.js');

  const translation = require('./translation.js');
  const express = require('express');
  const React = require('react');
  const request = require('request');
  const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
  const fs = require('fs-extra');
  const os = require('os');
  const path = require('path');
  const color = require('color');
  const toSlug = require('../core/toSlug.js');
  const mkdirp = require('mkdirp');
  const glob = require('glob');
  const chalk = require('chalk');
  const translate = require('./translate.js');
  const versionFallback = require('./versionFallback');
  const env = require('./env.js'); 
  const feed = require('./feed.js');
  const getDoc = require('./getDoc.js');
  const sitemap = require('./sitemap.js');
  const removeModuleAndChildrenFromCache = require('./cachePurge.js');
  // const sitemap = require("sitemap");

  const CWD = process.cwd();

  /****************************************************************************/

  let readMetadata = require('./readMetadata.js');
  let Metadata;
  let MetadataBlog;
  let siteConfig;

  function reloadMetadata() {
    removeModuleAndChildrenFromCache('./readMetadata.js');
    readMetadata.generateMetadataDocs();
    removeModuleAndChildrenFromCache('../core/metadata.js');
    Metadata = require('../core/metadata.js');
  }

  function reloadMetadataBlog() {
    if (fs.existsSync(__dirname + '/../core/MetadataBlog.js')) {
      removeModuleAndChildrenFromCache('../core/MetadataBlog.js');
      fs.removeSync(__dirname + '/../core/MetadataBlog.js');
    }
    readMetadata.generateMetadataBlog();
    MetadataBlog = require('../core/MetadataBlog.js');
  }

  function reloadSiteConfig() {
    removeModuleAndChildrenFromCache(CWD + '/siteConfig.js');
    siteConfig = require(CWD + '/siteConfig.js');

    if (siteConfig.highlight && siteConfig.highlight.hljs) {
      siteConfig.highlight.hljs(require('highlight.js'));
    }
  }

  /****************************************************************************/

  function isSeparateCss(file) {
    if (!siteConfig.separateCss) {
      return false;
    }
    for (let i = 0; i < siteConfig.separateCss.length; i++) {
      if (file.includes(siteConfig.separateCss[i])) {
        return true;
      }
    }
    return false;
  }

  function getPossibleLanguage(url)
  {
    const regexLang = /(.*)\/.*\.html$/;
    const match = regexLang.exec(url);
    let fragments = match[1].split('/');

    let validLangtags = env.translation.enabledLanguages().map((lang) => (lang.tag));

    // We need to search for this and provide a proper fallback URL for existing sites.
    validLangtags.push("en");

    let language = undefined;

    // We check all the splits for all the available languages. We will try any matches before falling back
    for (let i = 0; i < fragments.length; i++) {
      if (validLangtags.indexOf(fragments[i]) !== -1) {
        return fragments[i];
      }
    }
  }

  /****************************************************************************/

  reloadMetadata();
  reloadMetadataBlog();
  extractTranslations();
  reloadSiteConfig();

  // handle all requests for document pages
  const app = express();

  /****************************************************************************/
  // DOCS:
  app.get(/docs\/.*html$/, (req, res, next) => {
    // We have safe URLS, which falls back to the root file. We never fallback to 'en'
    let url = req.path.toString().replace(siteConfig.baseUrl, '');
    let fallbackUrl = url.replace(`/${language}/`, '/'); // Purely demonstrative
    
    // We split the request, and see if any sections match any the language
    // TODO: Unit test to make sure this spits out the first thing seen
    const language = getPossibleLanguage(req.path);

    // Dictionary containing the documentIds. Get the permalinks here!
    let links = {};
    Object.keys(Metadata).forEach(id => {
      const metadata = Metadata[id];
      links[metadata.permalink] = id;
    });

    // We don't any metadata matching the permalink, or a fallback permalink. We return a 404
    let metadata = Metadata[links[url]];
    if (!metadata) {
        next();
        return;
    }

    // Inside we do the lookup for the rawFile and wrap it in a React App
    // END: We flatten it to HTML. The end-user does not actually see the live React Code

    var reactApp = getDoc(metadata);

    res.send(renderToStaticMarkup(reactApp));
  });

  /****************************************************************************/

  app.get('/sitemap.xml', function(req, res) {
    res.set('Content-Type', 'application/xml');

    sitemap(xml => {
      res.send(xml);
    });
  });

  /****************************************************************************/

  app.get(/blog\/.*xml$/, (req, res) => {
    res.set('Content-Type', 'application/rss+xml');
    let parts = req.path.toString().split('blog/');
    if (parts[1].toLowerCase() == 'atom.xml') {
      res.send(feed('atom'));
      return;
    }
    res.send(feed('rss'));
  });

  /****************************************************************************/

  app.get(/blog\/.*xml$/, (req, res) => {
    res.set('Content-Type', 'application/rss+xml');
    let parts = req.path.toString().split('blog/');
    if (parts[1].toLowerCase() == 'atom.xml') {
      res.send(feed('atom'));
      return;
    }
    res.send(feed('rss'));
  });

  /****************************************************************************/
  // BLOG
  app.get(/blog\/.*html$/, (req, res) => {
    // generate all of the blog pages
    removeModuleAndChildrenFromCache('../core/BlogPageLayout.js');
    const BlogPageLayout = require('../core/BlogPageLayout.js');
    const blogPages = {};
    // make blog pages with 10 posts per page
    const perPage = 10;
    for (
      let page = 0;
      page < Math.ceil(MetadataBlog.length / perPage);
      page++
    ) {
      let language = 'en';
      const metadata = {page: page, perPage: perPage};
      const blogPageComp = (
        <BlogPageLayout
          metadata={metadata}
          language={language}
          config={siteConfig}
        />
      );
      const str = renderToStaticMarkup(blogPageComp);

      let path = (page > 0 ? 'page' + (page + 1) : '') + '/index.html';
      blogPages[path] = str;
    }

    let parts = req.path.toString().split('blog/');
    // send corresponding blog page if appropriate
    if (parts[1] === 'index.html') {
      res.send(blogPages['/index.html']);
    } else if (parts[1].endsWith('/index.html')) {
      res.send(blogPages[parts[1]]);
    } else if (parts[1].match(/page([0-9]+)/)) {
      if (parts[1].endsWith('/')) {
        res.send(blogPages[parts[1] + 'index.html']);
      } else {
        res.send(blogPages[parts[1] + '/index.html']);
      }
    } else {
      // else send corresponding blog post
      let file = parts[1];
      file = file.replace(/\.html$/, '.md');
      file = file.replace(new RegExp('/', 'g'), '-');
      file = CWD + '/blog/' + file;

      const result = readMetadata.extractMetadata(
        fs.readFileSync(file, {encoding: 'utf8'})
      );
      let rawContent = result.rawContent;
      rawContent = rawContent.replace(
        /\]\(assets\//g,
        '](' + siteConfig.baseUrl + 'blog/assets/'
      );
      const metadata = Object.assign(
        {path: req.path.toString().split('blog/')[1], content: rawContent},
        result.metadata
      );
      metadata.id = metadata.title;

      let language = 'en';
      removeModuleAndChildrenFromCache('../core/BlogPostLayout.js');
      const BlogPostLayout = require('../core/BlogPostLayout.js');

      const blogPostComp = (
        <BlogPostLayout
          metadata={metadata}
          language={language}
          config={siteConfig}>
          {rawContent}
        </BlogPostLayout>
      );
      res.send(renderToStaticMarkup(blogPostComp));
    }
  });

  /****************************************************************************/
  // PAGES
  app.get('*.html', (req, res, next) => {
    const language = getPossibleLanguage(req.path);

    let fileName = req.path.toString().replace(siteConfig.baseUrl, '');

    let htmlFile = fileName;
    let javascriptFile = fileName.replace(/\.html$/, '.js');

    // We are checking 4 files. We had this exact logic before, but split into 2 sections.
    // Is this DRY or not (answer, it's prolly not)
    let reqJs = `${CWD}/pages/${javascriptFile}`;
    let reqHtml = `${CWD}/pages/${htmlFile}`;
    let backupJs = reqJs; // We have to default here for now.
    let backupHtml = reqHtml; // We have to default here for now.
    
    // If language provided, set fallback to generic. If none provided, set fallback to English.
    if (language !== undefined) {
      backupJs = reqJs.replace(`/${language}/`, '/');
      backupHtml = reqHtml.replace(`/${language}/`, '/');
    } else { // Fallback to the en folder.
      backupJs = reqJs.replace(`/pages/`, `/pages/en/`);
      backupHtml = reqHtml.replace(`/pages/`, `/pages/en/`);
    }
    
    // Check Paths: The two possible HTML files, and the two possible JS Files.
    let validFile = 
    fs.existsSync(reqHtml) ? reqHtml : 
    fs.existsSync(backupHtml) ? backupHtml : 
    fs.existsSync(reqJs) ? reqJs : 
    fs.existsSync(backupJs) ? backupJs : null;

    if (validFile === null) {
      next();
      return; // Abort
    }

    // copy into docusaurus so require paths work
    let parts = validFile.split('pages/');
    let tempFile = __dirname + '/../pages/' + parts[1];
    tempFile = tempFile.replace(
      path.basename(javascriptFile),
      'temp' + path.basename(javascriptFile)
    );
    mkdirp.sync(tempFile.replace(new RegExp('/[^/]*$'), ''));
    fs.copySync(validFile, tempFile);

    // render into a string
    removeModuleAndChildrenFromCache(tempFile);
    const ReactComp = require(tempFile);
    removeModuleAndChildrenFromCache('../core/Site.js');
    const Site = require('../core/Site.js');
    translate.setLanguage(language);
    const str = renderToStaticMarkup(
      <Site language={language} config={siteConfig}>
        <ReactComp language={language} />
      </Site>
    );

    fs.removeSync(tempFile);

    res.send(str);
  });

  /****************************************************************************/
  // CSS: Generate the main.css file by concatenating user provided css to the end
  app.get(/main\.css$/, (req, res) => {
    const mainCssPath =
      __dirname +
      '/../static/' +
      req.path.toString().replace(siteConfig.baseUrl, '/');
    let cssContent = fs.readFileSync(mainCssPath, {encoding: 'utf8'});

    let files = glob.sync(CWD + '/static/**/*.css');

    files.forEach(file => {
      if (isSeparateCss(file)) {
        return;
      }
      cssContent =
        cssContent + '\n' + fs.readFileSync(file, {encoding: 'utf8'});
    });

    if (
      !siteConfig.colors ||
      !siteConfig.colors.primaryColor ||
      !siteConfig.colors.secondaryColor
    ) {
      console.error(
        `${chalk.yellow(
          'Missing color configuration.'
        )} Make sure siteConfig.colors includes primaryColor and secondaryColor fields.`
      );
    }

    Object.keys(siteConfig.colors).forEach(key => {
      const color = siteConfig.colors[key];
      cssContent = cssContent.replace(new RegExp('\\$' + key, 'g'), color);
    });
    const codeColor = color(siteConfig.colors.primaryColor)
      .alpha(0.07)
      .string();
    cssContent = cssContent.replace(new RegExp('\\$codeColor', 'g'), codeColor);

    res.send(cssContent);
  });

  // serve static assets from these locations
  app.use(
    siteConfig.baseUrl + 'docs/assets/',
    express.static(CWD + '/../' + readMetadata.getDocsPath() + '/assets')
  );
  app.use(
    siteConfig.baseUrl + 'blog/assets/',
    express.static(CWD + '/blog/assets')
  );
  app.use(siteConfig.baseUrl, express.static(CWD + '/static'));
  app.use(siteConfig.baseUrl, express.static(__dirname + '/../static'));

  // "redirect" requests to pages ending with "/" or no extension so that
  // request to "...blog" returns same result as "...blog/index.html"
  app.get(/\/[^\.]*\/?$/, (req, res) => {
    if (req.path.toString().endsWith('/')) {
      request.get(
        'http://localhost:' + port + req.path + 'index.html',
        (err, response, body) => {
          if (!err) {
            res.send(body);
          }
        }
      );
    } else {
      request.get(
        'http://localhost:' + port + req.path + '/index.html',
        (err, response, body) => {
          if (!err) {
            res.send(body);
          }
        }
      );
    }
  });

  app.listen(port);
  console.log('Open http://localhost:' + port + '/');
}

module.exports = execute;
