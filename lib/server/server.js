/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-cond-assign */

function execute(port, options) {
  const extractTranslations = require('../write-translations');
  const metadataUtils = require('./metadataUtils');
  const blog = require('./blog');
  const docs = require('./docs');
  const env = require('./env.js');
  const express = require('express');
  const React = require('react');
  const request = require('request');
  const fs = require('fs-extra');
  const path = require('path');
  const {isSeparateCss} = require('./utils');
  const mkdirp = require('mkdirp');
  const glob = require('glob');
  const chalk = require('chalk');
  const gaze = require('gaze');
  const tinylr = require('tiny-lr');
  const constants = require('../core/constants');
  const translate = require('./translate');
  const {renderToStaticMarkupWithDoctype} = require('./renderUtils');
  const feed = require('./feed');
  const sitemap = require('./sitemap');
  const routing = require('./routing');
  const CWD = process.cwd();
  const join = path.join;
  const sep = path.sep;

  function removeModulePathFromCache(moduleName) {
    /* eslint-disable no-underscore-dangle */
    Object.keys(module.constructor._pathCache).forEach(cacheKey => {
      if (cacheKey.indexOf(moduleName) > 0) {
        delete module.constructor._pathCache[cacheKey];
      }
    });
  }

  // Remove a module and child modules from require cache, so server
  // does not have to be restarted.
  function removeModuleAndChildrenFromCache(moduleName) {
    let mod = require.resolve(moduleName);
    if (mod && (mod = require.cache[mod])) {
      mod.children.forEach(child => {
        delete require.cache[child.id];
        removeModulePathFromCache(mod.id);
      });
      delete require.cache[mod.id];
      removeModulePathFromCache(mod.id);
    }
  }

  const readMetadata = require('./readMetadata.js');
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
    if (fs.existsSync(join(__dirname, '..', 'core', 'MetadataBlog.js'))) {
      removeModuleAndChildrenFromCache(join('..', 'core', 'MetadataBlog.js'));
      fs.removeSync(join(__dirname, '..', 'core', 'MetadataBlog.js'));
    }
    readMetadata.generateMetadataBlog();
    MetadataBlog = require(join('..', 'core', 'MetadataBlog.js'));
  }

  function reloadSiteConfig() {
    removeModuleAndChildrenFromCache(join(CWD, 'siteConfig.js'));
    siteConfig = require(join(CWD, 'siteConfig.js'));

    if (siteConfig.highlight && siteConfig.highlight.hljs) {
      siteConfig.highlight.hljs(require('highlight.js'));
    }
  }

  function requestFile(url, res, notFoundCallback) {
    request.get(url, (error, response, body) => {
      if (!error) {
        if (response) {
          if (response.statusCode === 404 && notFoundCallback) {
            notFoundCallback();
          } else {
            res.status(response.statusCode).send(body);
          }
        } else {
          console.error('No response');
        }
      } else {
        console.error('Request failed:', error);
      }
    });
  }

  function startLiveReload() {
    process.env.NODE_ENV = 'development';
    const server = tinylr();
    server.listen(constants.LIVE_RELOAD_PORT, () => {
      console.log(
        'LiveReload server started on port %d',
        constants.LIVE_RELOAD_PORT
      );
    });

    gaze(
      [`../${readMetadata.getDocsPath()}/**/*`, '**/*', '!node_modules/**/*'],
      function() {
        this.on('all', () => {
          server.notifyClients(['/']);
        });
      }
    );
  }

  reloadMetadata();
  reloadMetadataBlog();
  extractTranslations();
  reloadSiteConfig();

  const app = express();

  app.get(routing.docs(siteConfig.baseUrl), (req, res, next) => {
    const url = req.path.toString().replace(siteConfig.baseUrl, '');
    const metadata =
      Metadata[
        Object.keys(Metadata).find(id => Metadata[id].permalink === url)
      ];
    const file = docs.getFile(metadata);
    if (!file) {
      next();
      return;
    }
    const rawContent = metadataUtils.extractMetadata(file).rawContent;
    removeModuleAndChildrenFromCache('../core/DocsLayout.js');
    const mdToHtml = metadataUtils.mdToHtml(Metadata, siteConfig.baseUrl);
    res.send(docs.getMarkup(rawContent, mdToHtml, metadata));
  });

  app.get(routing.sitemap(siteConfig.baseUrl), (req, res) => {
    sitemap((err, xml) => {
      if (err) {
        res.status(500).send('Sitemap error');
      } else {
        res.set('Content-Type', 'application/xml');
        res.send(xml);
      }
    });
  });

  app.get(routing.feed(siteConfig.baseUrl), (req, res, next) => {
    res.set('Content-Type', 'application/rss+xml');
    const file = req.path
      .toString()
      .split('blog/')[1]
      .toLowerCase();
    if (file === 'atom.xml') {
      res.send(feed('atom'));
    } else if (file === 'feed.xml') {
      res.send(feed('rss'));
    }
    next();
  });

  app.get(routing.blog(siteConfig.baseUrl), (req, res, next) => {
    // Regenerate the blog metadata in case it has changed. Consider improving
    // this to regenerate on file save rather than on page request.
    reloadMetadataBlog();
    removeModuleAndChildrenFromCache(join('..', 'core', 'BlogPageLayout.js'));
    const blogPages = blog.getPagesMarkup(MetadataBlog.length, siteConfig);
    const urlPath = req.path.toString().split('blog/')[1];

    if (urlPath === 'index.html') {
      res.send(blogPages['/index.html']);
    } else if (urlPath.endsWith('/index.html') && blogPages[urlPath]) {
      res.send(blogPages[urlPath]);
    } else if (urlPath.match(/page([0-9]+)/)) {
      res.send(blogPages[`${urlPath.replace(/\/$/, '')}/index.html`]);
    } else {
      const file = join(CWD, 'blog', blog.urlToSource(urlPath));
      removeModuleAndChildrenFromCache(join('..', 'core', 'BlogPostLayout.js'));
      const blogPost = blog.getPostMarkup(file, siteConfig);
      if (!blogPost) {
        next();
        return;
      }
      res.send(blogPost);
    }
  });

  app.get(routing.page(siteConfig.baseUrl), (req, res, next) => {
    // Look for user-provided HTML file first.
    let htmlFile = req.path.toString().replace(siteConfig.baseUrl, '');
    htmlFile = join(CWD, 'pages', htmlFile);
    if (
      fs.existsSync(htmlFile) ||
      fs.existsSync(
        (htmlFile = htmlFile.replace(
          path.basename(htmlFile),
          join('en', path.basename(htmlFile))
        ))
      )
    ) {
      if (siteConfig.wrapPagesHTML) {
        removeModuleAndChildrenFromCache(join('..', 'core', 'Site.js'));
        const Site = require(join('..', 'core', 'Site.js'));
        const str = renderToStaticMarkupWithDoctype(
          <Site
            language="en"
            config={siteConfig}
            metadata={{id: path.basename(htmlFile, '.html')}}>
            <div
              dangerouslySetInnerHTML={{
                __html: fs.readFileSync(htmlFile, {encoding: 'utf8'}),
              }}
            />
          </Site>
        );

        res.send(str);
      } else {
        res.send(fs.readFileSync(htmlFile, {encoding: 'utf8'}));
      }
      next();
      return;
    }

    // look for user provided react file either in specified path or in path for english files
    let file = req.path.toString().replace(/\.html$/, '.js');
    file = file.replace(siteConfig.baseUrl, '');
    let userFile = join(CWD, 'pages', file);

    let language = env.translation.enabled ? 'en' : '';
    const regexLang = /(.*)\/.*\.html$/;
    const match = regexLang.exec(req.path);
    const parts = match[1].split('/');
    const enabledLangTags = env.translation
      .enabledLanguages()
      .map(lang => lang.tag);

    for (let i = 0; i < parts.length; i++) {
      if (enabledLangTags.indexOf(parts[i]) !== -1) {
        language = parts[i];
      }
    }
    let englishFile = join(CWD, 'pages', file);
    if (language && language !== 'en') {
      englishFile = englishFile.replace(sep + language + sep, `${sep}en${sep}`);
    }

    // check for: a file for the page, an english file for page with unspecified language, or an
    // english file for the page
    if (
      fs.existsSync(userFile) ||
      fs.existsSync(
        (userFile = userFile.replace(
          path.basename(userFile),
          `en${sep}${path.basename(userFile)}`
        ))
      ) ||
      fs.existsSync((userFile = englishFile))
    ) {
      // copy into docusaurus so require paths work
      const userFileParts = userFile.split(`pages${sep}`);
      let tempFile = join(__dirname, '..', 'pages', userFileParts[1]);
      tempFile = tempFile.replace(
        path.basename(file),
        `temp${path.basename(file)}`
      );
      mkdirp.sync(path.dirname(tempFile));
      fs.copySync(userFile, tempFile);

      // render into a string
      removeModuleAndChildrenFromCache(tempFile);
      const ReactComp = require(tempFile);
      removeModuleAndChildrenFromCache(join('..', 'core', 'Site.js'));
      const Site = require(join('..', 'core', 'Site.js'));
      translate.setLanguage(language);
      const str = renderToStaticMarkupWithDoctype(
        <Site
          language={language}
          config={siteConfig}
          title={ReactComp.title}
          description={ReactComp.description}
          metadata={{id: path.basename(userFile, '.js')}}>
          <ReactComp language={language} />
        </Site>
      );

      fs.removeSync(tempFile);

      res.send(str);
    } else {
      next();
    }
  });

  app.get(/main\.css$/, (req, res) => {
    const mainCssPath = join(
      __dirname,
      '..',
      'static',
      req.path.toString().replace(siteConfig.baseUrl, '/')
    );
    let cssContent = fs.readFileSync(mainCssPath, {encoding: 'utf8'});

    const files = glob.sync(join(CWD, 'static', '**', '*.css'));

    files.forEach(file => {
      if (isSeparateCss(file, siteConfig.separateCss)) {
        return;
      }
      cssContent = `${cssContent}\n${fs.readFileSync(file, {
        encoding: 'utf8',
      })}`;
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
      cssContent = cssContent.replace(new RegExp(`\\$${key}`, 'g'), color);
    });

    if (siteConfig.fonts) {
      Object.keys(siteConfig.fonts).forEach(key => {
        const fontString = siteConfig.fonts[key]
          .map(font => `"${font}"`)
          .join(', ');
        cssContent = cssContent.replace(
          new RegExp(`\\$${key}`, 'g'),
          fontString
        );
      });
    }

    res.header('Content-Type', 'text/css');
    res.send(cssContent);
  });

  // serve static assets from these locations
  app.use(
    `${siteConfig.baseUrl}docs/assets`,
    express.static(join(CWD, '..', readMetadata.getDocsPath(), 'assets'))
  );
  app.use(
    `${siteConfig.baseUrl}blog/assets`,
    express.static(join(CWD, 'blog', 'assets'))
  );
  app.use(siteConfig.baseUrl, express.static(join(CWD, 'static')));
  app.use(siteConfig.baseUrl, express.static(join(__dirname, '..', 'static')));

  // "redirect" requests to pages ending with "/" or no extension so that,
  // for example, request to "blog" returns "blog/index.html" or "blog.html"
  app.get(routing.noExtension(), (req, res, next) => {
    const slash = req.path.toString().endsWith('/') ? '' : '/';
    const requestUrl = `http://localhost:${port}${req.path}`;
    requestFile(`${requestUrl + slash}index.html`, res, () => {
      requestFile(
        slash === '/'
          ? `${requestUrl}.html`
          : requestUrl.replace(/\/$/, '.html'),
        res,
        next
      );
    });
  });

  // handle special cleanUrl case like '/blog/1.2.3' & '/blog.robots.hai'
  // where we should try to serve '/blog/1.2.3.html' & '/blog.robots.hai.html'
  app.get(routing.dotfiles(), (req, res, next) => {
    if (!siteConfig.cleanUrl) {
      next();
      return;
    }
    requestFile(`http://localhost:${port}${req.path}.html`, res, next);
  });

  if (options.watch) startLiveReload();
  app.listen(port);
}

module.exports = execute;
