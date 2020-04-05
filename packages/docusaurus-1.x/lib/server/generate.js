/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

async function execute() {
  const commander = require('commander');
  commander
    .option('--skip-image-compression')
    .option('--skip-next-release')
    .parse(process.argv);
  require('../write-translations.js');
  const metadataUtils = require('./metadataUtils');
  const blog = require('./blog');
  const docs = require('./docs');
  const CWD = process.cwd();
  const fs = require('fs-extra');
  const readMetadata = require('./readMetadata.js');
  const path = require('path');
  const {minifyCss, isSeparateCss, autoPrefixCss} = require('./utils');
  const React = require('react');
  const mkdirp = require('mkdirp');
  const glob = require('glob');
  const chalk = require('chalk');
  const Site = require('../core/Site.js');
  const env = require('./env.js');
  const loadConfig = require('./config.js');
  const siteConfig = loadConfig(`${CWD}/siteConfig.js`);
  const translate = require('./translate.js');
  const feed = require('./feed.js');
  const sitemap = require('./sitemap.js');
  const join = path.join;
  const sep = path.sep;
  const escapeStringRegexp = require('escape-string-regexp');
  const {renderToStaticMarkupWithDoctype} = require('./renderUtils');
  const imagemin = require('imagemin');
  const imageminJpegtran = require('imagemin-jpegtran');
  const imageminOptipng = require('imagemin-optipng');
  const imageminSvgo = require('imagemin-svgo');
  const imageminGifsicle = require('imagemin-gifsicle');

  // create the folder path for a file if it does not exist, then write the file
  function writeFileAndCreateFolder(file, content) {
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, content);

    // build extra file for extension-less url if "cleanUrl" siteConfig is true
    if (siteConfig.cleanUrl && file.indexOf('index.html') === -1) {
      const extraFile = file.replace(/\.html$/, '/index.html');
      mkdirp.sync(path.dirname(extraFile));
      fs.writeFileSync(extraFile, content);
    }
  }

  console.log('generate.js triggered...');

  readMetadata.generateMetadataDocs();
  const Metadata = require('../core/metadata.js');

  // TODO: what if the project is a github org page? We should not use
  // siteConfig.projectName in this case. Otherwise a GitHub org doc URL would
  // look weird: https://myorg.github.io/myorg/docs

  // TODO: siteConfig.projectName is a misnomer. The actual project name is
  // `title`. `projectName` is only used to generate a folder, which isn't
  // needed when the project's a GitHub org page

  const buildDir = join(CWD, 'build', siteConfig.projectName);
  fs.removeSync(join(CWD, 'build'));

  // create html files for all docs by going through all doc ids
  const mdToHtml = metadataUtils.mdToHtml(Metadata, siteConfig);
  Object.keys(Metadata).forEach((id) => {
    const metadata = Metadata[id];
    const file = docs.getFile(metadata);
    if (!file) {
      return;
    }
    const rawContent = metadataUtils.extractMetadata(file).rawContent;
    const str = docs.getMarkup(rawContent, mdToHtml, metadata, siteConfig);
    const targetFile = join(buildDir, metadata.permalink);
    writeFileAndCreateFolder(targetFile, str);

    // generate english page redirects when languages are enabled
    const redirectMarkup = docs.getRedirectMarkup(metadata, siteConfig);
    if (!redirectMarkup) {
      return;
    }
    const docsPart = `${siteConfig.docsUrl ? `${siteConfig.docsUrl}/` : ''}`;
    const redirectFile = join(
      buildDir,
      metadata.permalink.replace(
        new RegExp(`^${docsPart}en`),
        siteConfig.docsUrl,
      ),
    );
    writeFileAndCreateFolder(redirectFile, redirectMarkup);
  });

  // copy docs assets if they exist
  if (fs.existsSync(join(CWD, '..', readMetadata.getDocsPath(), 'assets'))) {
    fs.copySync(
      join(CWD, '..', readMetadata.getDocsPath(), 'assets'),
      join(buildDir, siteConfig.docsUrl, 'assets'),
    );
  }

  // create html files for all blog posts (each article)
  if (fs.existsSync(join(__dirname, '..', 'core', 'MetadataBlog.js'))) {
    fs.removeSync(join(__dirname, '..', 'core', 'MetadataBlog.js'));
  }
  readMetadata.generateMetadataBlog(siteConfig);
  const MetadataBlog = require('../core/MetadataBlog.js');

  let files = glob.sync(join(CWD, 'blog', '**', '*.*'));
  files
    .sort()
    .reverse()
    .forEach((file) => {
      // Why normalize? In case we are on Windows.
      // Remember the nuance of glob: https://www.npmjs.com/package/glob#windows
      const normalizedFile = path.normalize(file);
      const extension = path.extname(normalizedFile);
      if (extension !== '.md' && extension !== '.markdown') {
        return;
      }
      const urlPath = blog.fileToUrl(normalizedFile);
      const blogPost = blog.getPostMarkup(normalizedFile, siteConfig);
      if (!blogPost) {
        return;
      }
      const targetFile = join(buildDir, 'blog', urlPath);
      writeFileAndCreateFolder(targetFile, blogPost);
    });

  // create html files for all blog pages (collections of article previews)
  const blogPages = blog.getPagesMarkup(MetadataBlog.length, siteConfig);
  Object.keys(blogPages).forEach((pagePath) => {
    const targetFile = join(buildDir, 'blog', pagePath);
    writeFileAndCreateFolder(targetFile, blogPages[pagePath]);
  });

  // create rss files for all blog pages, if there are any blog files
  if (MetadataBlog.length > 0) {
    let targetFile = join(buildDir, 'blog', 'feed.xml');
    writeFileAndCreateFolder(targetFile, feed());
    targetFile = join(buildDir, 'blog', 'atom.xml');
    writeFileAndCreateFolder(targetFile, feed('atom'));
  }

  // create sitemap
  if (MetadataBlog.length > 0 || Object.keys(Metadata).length > 0) {
    sitemap((err, xml) => {
      if (!err) {
        const targetFile = join(buildDir, 'sitemap.xml');
        writeFileAndCreateFolder(targetFile, xml);
      }
    });
  }

  // copy blog assets if they exist
  if (fs.existsSync(join(CWD, 'blog', 'assets'))) {
    fs.copySync(join(CWD, 'blog', 'assets'), join(buildDir, 'blog', 'assets'));
  }

  // copy all static files from docusaurus
  const libStaticDir = join(__dirname, '..', 'static');
  files = glob.sync(join(libStaticDir, '**'));
  files.forEach((file) => {
    // Why normalize? In case we are on Windows.
    // Remember the nuance of glob: https://www.npmjs.com/package/glob#windows
    const targetFile = path.normalize(file).replace(libStaticDir, buildDir);
    // parse css files to replace colors according to siteConfig
    if (file.match(/\.css$/)) {
      let cssContent = fs.readFileSync(file, 'utf8');

      if (
        !siteConfig.colors ||
        !siteConfig.colors.primaryColor ||
        !siteConfig.colors.secondaryColor
      ) {
        console.error(
          `${chalk.yellow(
            'Missing color configuration.',
          )} Make sure siteConfig.colors includes primaryColor and secondaryColor fields.`,
        );
      }

      Object.keys(siteConfig.colors).forEach((key) => {
        const color = siteConfig.colors[key];
        cssContent = cssContent.replace(new RegExp(`\\$${key}`, 'g'), color);
      });

      if (siteConfig.fonts) {
        Object.keys(siteConfig.fonts).forEach((key) => {
          const fontString = siteConfig.fonts[key]
            .map((font) => `"${font}"`)
            .join(', ');
          cssContent = cssContent.replace(
            new RegExp(`\\$${key}`, 'g'),
            fontString,
          );
        });
      }

      mkdirp.sync(path.dirname(targetFile));
      fs.writeFileSync(targetFile, cssContent);
    } else if (!fs.lstatSync(file).isDirectory()) {
      mkdirp.sync(path.dirname(targetFile));
      fs.copySync(file, targetFile);
    }
  });

  // Copy all static files from user.
  const userStaticDir = join(CWD, 'static');
  files = glob.sync(join(userStaticDir, '**'), {dot: true});
  files.forEach((file) => {
    // Why normalize? In case we are on Windows.
    // Remember the nuance of glob: https://www.npmjs.com/package/glob#windows
    const normalizedFile = path.normalize(file);
    // parse css files to replace colors and fonts according to siteConfig
    if (
      normalizedFile.match(/\.css$/) &&
      !isSeparateCss(normalizedFile, siteConfig.separateCss)
    ) {
      const mainCss = join(buildDir, 'css', 'main.css');
      let cssContent = fs.readFileSync(normalizedFile, 'utf8');
      cssContent = `${fs.readFileSync(mainCss, 'utf8')}\n${cssContent}`;

      Object.keys(siteConfig.colors).forEach((key) => {
        const color = siteConfig.colors[key];
        cssContent = cssContent.replace(new RegExp(`\\$${key}`, 'g'), color);
      });

      if (siteConfig.fonts) {
        Object.keys(siteConfig.fonts).forEach((key) => {
          const fontString = siteConfig.fonts[key]
            .map((font) => `"${font}"`)
            .join(', ');
          cssContent = cssContent.replace(
            new RegExp(`\\$${key}`, 'g'),
            fontString,
          );
        });
      }

      fs.writeFileSync(mainCss, cssContent);
    } else if (
      normalizedFile.match(/\.png$|.jpg$|.svg$|.gif$/) &&
      !commander.skipImageCompression
    ) {
      const parts = normalizedFile.split(`${sep}static${sep}`);
      const targetFile = join(buildDir, parts[1]);
      const targetDirectory = path.dirname(targetFile);
      mkdirp.sync(targetDirectory);
      imagemin([normalizedFile], targetDirectory, {
        use: [
          imageminOptipng(),
          imageminJpegtran(),
          imageminSvgo({
            plugins: [{removeViewBox: false}],
          }),
          imageminGifsicle(),
        ],
      }).catch((error) => {
        // if image compression fail, just copy it as it is
        console.error(error);
        fs.copySync(normalizedFile, targetFile);
      });
    } else if (!fs.lstatSync(normalizedFile).isDirectory()) {
      const targetFile = normalizedFile.replace(userStaticDir, buildDir);
      mkdirp.sync(path.dirname(targetFile));
      fs.copySync(normalizedFile, targetFile);
    }
  });

  // Use cssnano to minify the final combined CSS.
  // Use autoprefixer to add vendor prefixes
  const mainCss = join(buildDir, 'css', 'main.css');
  const cssContent = fs.readFileSync(mainCss, 'utf8');
  const minifiedCSS = await minifyCss(cssContent);
  const css = await autoPrefixCss(minifiedCSS);
  fs.writeFileSync(mainCss, css);

  // compile/copy pages from user
  const enabledLanguages = env.translation
    .enabledLanguages()
    .map((lang) => lang.tag);
  const userPagesDir = join(CWD, 'pages');
  files = glob.sync(join(userPagesDir, '**'));
  files.forEach((file) => {
    // Why normalize? In case we are on Windows.
    // Remember the nuance of glob: https://www.npmjs.com/package/glob#windows
    const normalizedFile = path.normalize(file);
    const relativeFile = normalizedFile.replace(userPagesDir, '');
    // render .js files to strings
    if (normalizedFile.match(/\.js$/)) {
      const pageID = path.basename(normalizedFile, '.js');

      // make temp file for sake of require paths
      let tempFile = join(__dirname, '..', 'pages', relativeFile);
      tempFile = tempFile.replace(
        path.basename(normalizedFile),
        `temp${path.basename(normalizedFile)}`,
      );
      mkdirp.sync(path.dirname(tempFile));
      fs.copySync(normalizedFile, tempFile);

      const ReactComp = require(tempFile);

      let targetFile = join(buildDir, relativeFile);
      targetFile = targetFile.replace(/\.js$/, '.html');

      const regexLang = new RegExp(
        `${escapeStringRegexp(`${userPagesDir}${sep}`)}(.*)${escapeStringRegexp(
          sep,
        )}`,
      );
      const match = regexLang.exec(normalizedFile);
      const langParts = match[1].split(sep);
      if (langParts.indexOf('en') !== -1) {
        // Copy and compile a page for each enabled language from the English file.
        for (let i = 0; i < enabledLanguages.length; i++) {
          const language = enabledLanguages[i];
          // Skip conversion from English file if a file exists for this language.
          if (
            language === 'en' ||
            !fs.existsSync(
              normalizedFile.replace(`${sep}en${sep}`, sep + language + sep),
            )
          ) {
            translate.setLanguage(language);
            const str = renderToStaticMarkupWithDoctype(
              <Site
                language={language}
                config={siteConfig}
                title={ReactComp.title}
                description={ReactComp.description}
                metadata={{id: pageID}}>
                <ReactComp config={siteConfig} language={language} />
              </Site>,
            );
            writeFileAndCreateFolder(
              // TODO: use path functions
              targetFile.replace(`${sep}en${sep}`, sep + language + sep),
              str,
            );
          }
        }

        // write to base level
        const language = env.translation.enabled ? 'en' : '';
        translate.setLanguage(language);
        const str = renderToStaticMarkupWithDoctype(
          <Site
            title={ReactComp.title}
            language={language}
            config={siteConfig}
            description={ReactComp.description}
            metadata={{id: pageID}}>
            <ReactComp config={siteConfig} language={language} />
          </Site>,
        );
        writeFileAndCreateFolder(
          targetFile.replace(`${sep}en${sep}`, sep),
          str,
        );
      } else {
        // allow for rendering of other files not in pages/en folder
        const language = env.translation.enabled ? 'en' : '';
        translate.setLanguage(language);
        const str = renderToStaticMarkupWithDoctype(
          <Site
            title={ReactComp.title}
            language={language}
            config={siteConfig}
            description={ReactComp.description}
            metadata={{id: pageID}}>
            <ReactComp config={siteConfig} language={language} />
          </Site>,
        );
        writeFileAndCreateFolder(
          targetFile.replace(`${sep}en${sep}`, sep),
          str,
        );
      }
      fs.removeSync(tempFile);
    } else if (siteConfig.wrapPagesHTML && normalizedFile.match(/\.html$/)) {
      const pageID = path.basename(normalizedFile, '.html');
      const targetFile = join(buildDir, relativeFile);
      const str = renderToStaticMarkupWithDoctype(
        <Site language="en" config={siteConfig} metadata={{id: pageID}}>
          <div
            dangerouslySetInnerHTML={{
              __html: fs.readFileSync(normalizedFile, {encoding: 'utf8'}),
            }}
          />
        </Site>,
      );

      writeFileAndCreateFolder(targetFile, str);
    } else if (!fs.lstatSync(normalizedFile).isDirectory()) {
      // copy other non .js files
      const targetFile = join(buildDir, relativeFile);
      mkdirp.sync(path.dirname(targetFile));
      fs.copySync(normalizedFile, targetFile);
    }
  });

  // Generate CNAME file if a custom domain is specified in siteConfig
  if (siteConfig.cname) {
    const targetFile = join(buildDir, 'CNAME');
    fs.writeFileSync(targetFile, siteConfig.cname);
  }
}

module.exports = execute;
