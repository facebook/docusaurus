/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function execute() {
  const CWD = process.cwd();
  const fs = require('fs-extra');
  const readMetadata = require('./readMetadata.js');
  const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
  const path = require('path');
  const color = require('color');
  const React = require('react');
  const mkdirp = require('mkdirp');
  const glob = require('glob');
  const chalk = require('chalk');
  const Site = require('../core/Site.js');
  const env = require('./env.js');
  const render = require('./render.js');
  const siteConfig = require(CWD + '/siteConfig.js');
  const getPage = require('./getPage.js');
  const feed = require('./feed.js');
  const sitemap = require('./sitemap.js');

  const duplicatePages = true;

  const join = path.join;

  const possibleLanguages = env.translation.enabledLanguageTags();
  possibleLanguages[possibleLanguages.length] = undefined; // Add undefined

  // create the folder path for a file if it does not exist, then write the file
  function writeData(file, content) {
    // console.log(`Creating: ${file}`);
    var parsed = path.parse(file)
    mkdirp.sync(parsed.dir);
    fs.writeFileSync(file, content);
  }

  // create the folder path for a file if it does not exist, then write the file
  function copyFile(source, target) {
    // console.log(`Copying: ${target}`);
    var parsed = path.parse(target)
    mkdirp.sync(parsed.dir);
    fs.copyFileSync(source, target);
  }

  const getLanguagePart = (filePath) => {
      var relative = path.relative(path.join(CWD,'pages'),filePath); 
      var split = relative.split(path.delimiter)[0];
      
      // See if it matches any of the available langauges;
      const matches = possibleLanguages.filter(lang => lang == split);
      return split.length > 1 && matches.length > 0 ? matches[0] : undefined;
  } 

  // returns true if a file should be excluded from concatentation to
  // default Docusaurus styles
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

  console.log(chalk.red(`Removing existing build directory!`));
  const buildDir = join(CWD, 'build', siteConfig.projectName);

  
  fs.removeSync(buildDir);
  console.log(`Building site to directory: ${chalk.blue(buildDir)}`);
  
  readMetadata.generateMetadataDocs();
  const Metadata = require('../core/metadata.js');

  // TODO: what if the project is a github org page? We should not use
  // siteConfig.projectName in this case. Otherwise a GitHub org doc URL would
  // look weird: https://myorg.github.io/myorg/docs

  // TODO: siteConfig.projectName is a misnomer. The actual project name is
  // `title`. `projectName` is only used to generate a folder, which isn't
  // needed when the project's a GitHub org page


  // mdToHtml is a map from a markdown file name to its html link, used to
  // change relative markdown links that work on GitHub into actual site links
  const mdToHtml = render.markdown.mdToHtml(Metadata);

  const DocsLayout = require('../core/DocsLayout.js');
  const Redirect = require('../core/Redirect.js');

  fs.removeSync(join(CWD, 'build'));
  
  let possibleRedirects = [];

  // DOCS: We already have all the correct languages in the metadata
  Object.keys(Metadata).forEach(id => {
    const metadata = Metadata[id];

    const rawHtml = render.docs.render(metadata, mdToHtml);

    const targetFile = join(buildDir, metadata.permalink);
    writeData(targetFile, rawHtml);
  });

  // copy docs assets if they exist
  if (fs.existsSync(join(CWD, '..', readMetadata.getDocsPath(), 'assets'))) {
    fs.copySync(
      join(CWD, '..', readMetadata.getDocsPath(), 'assets'),
      join(buildDir, 'docs', 'assets')
    );
  }

  // create html files for all blog posts (each article)
  if (fs.existsSync(join(__dirname, '..', 'core', 'MetadataBlog.js'))) {
    fs.removeSync(join(__dirname, '..', 'core', 'MetadataBlog.js'));
  }
  readMetadata.generateMetadataBlog();
  const MetadataBlog = require('../core/MetadataBlog.js');
  const BlogPostLayout = require('../core/BlogPostLayout.js');

  let files = glob.sync(join(CWD, 'blog', '**', '*.*'));
  files
    .sort()
    .reverse()
    .forEach(file => {
      const extension = path.extname(file);
      if (extension !== '.md' && extension !== '.markdown') {
        return;
      }

      // convert filename to use slashes
      const filePath = path
        .basename(file)
        .replace('-', '/')
        .replace('-', '/')
        .replace('-', '/')
        .replace(/\.md$/, '.html');
      const result = readMetadata.extractMetadata(
        fs.readFileSync(file, {encoding: 'utf8'})
      );
      const rawContent = result.rawContent;
      const metadata = Object.assign(
        {path: filePath, content: rawContent},
        result.metadata
      );
      metadata.id = metadata.title;

      let language = 'en';
      const blogPostComp = (
        <BlogPostLayout
          metadata={metadata}
          language={language}
          config={siteConfig}>
          {rawContent}
        </BlogPostLayout>
      );
      const str = renderToStaticMarkup(blogPostComp);

      let targetFile = join(buildDir, 'blog', filePath);
      writeData(targetFile, str);
    });
  // create html files for all blog pages (collections of article previews)
  const BlogPageLayout = require('../core/BlogPageLayout.js');
  const perPage = 10;
  for (let page = 0; page < Math.ceil(MetadataBlog.length / perPage); page++) {
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

    let targetFile = join(
      buildDir,
      'blog',
      page > 0 ? 'page' + (page + 1) : '',
      'index.html'
    );
    writeData(targetFile, str);
  }
  // create rss files for all blog pages, if there are any blog files
  if (MetadataBlog.length > 0) {
    let targetFile = join(buildDir, 'blog', 'feed.xml');
    writeData(targetFile, feed());
    targetFile = join(buildDir, 'blog', 'atom.xml');
    writeData(targetFile, feed('atom'));
  }

  // create sitemap
  if (MetadataBlog.length > 0 && Object.keys(Metadata).length > 0) {
    let targetFile = join(buildDir, 'sitemap.xml');
    sitemap(xml => {
      writeData(targetFile, xml);
    });
  }

  // copy blog assets if they exist
  if (fs.existsSync(join(CWD, 'blog', 'assets'))) {
    fs.copySync(join(CWD, 'blog', 'assets'), join(buildDir, 'blog', 'assets'));
  }

  // LIB STATIC
  let docusaurusStatic = join(__dirname, '..', 'static');
  files = glob.sync(join(docusaurusStatic, '**'), { nodir: true });
  files.forEach(file => {
    // Determine file destination
    let targetFile = join(buildDir, path.relative(docusaurusStatic, file));

    if (file.match(/\.css$/)) {
      // Process the CSS.
      let rawCss = fs.readFileSync(file, 'utf8');
      
      // Parse css files to replace colors according to siteConfig
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
        rawCss = rawCss.replace(new RegExp('\\$' + key, 'g'), color);
      });
      const codeColor = color(siteConfig.colors.primaryColor)
        .alpha(0.07)
        .string();
      rawCss = rawCss.replace(
        new RegExp('\\$codeColor', 'g'),
        codeColor
      );

      writeData(targetFile, rawCss);
      return;
    } 
    copyFile(file, targetFile);
  });

  // WEBSITE STATIC
  let websiteStatic = join(CWD, 'static');
  files = glob.sync(join(websiteStatic, '**'), {dot: true, nodir: true });
  files.forEach(file => {
    // Determine file destination
    let targetFile = join(buildDir, path.relative(websiteStatic, file));

    // Parse css files to replace colors according to siteConfig
    if (file.match(/\.css$/) && !isSeparateCss(file)) {
      // We always convert to main CSS to prevent possible mistakes?
      const mainCss = join(buildDir, 'css', 'main.css');
      let cssContent = fs.readFileSync(file, 'utf8');
      cssContent = fs.readFileSync(mainCss, 'utf8') + '\n' + cssContent;

      Object.keys(siteConfig.colors).forEach(key => {
        const color = siteConfig.colors[key];
        cssContent = cssContent.replace(new RegExp('\\$' + key, 'g'), color);
      });

      writeData(mainCss, cssContent);
      return
    } 

    copyFile(file, targetFile);
  });

  // We will create all the files we have, and fill in the blanks with the 'best' version.
  var redirectNeeded = [];
  
  // PAGES
  let websitePages = join(CWD, 'pages', '**');
  files = glob.sync(websitePages, { nodir: true });
 
  files.forEach(original => {
    // Lots of path logic. It's complicated, and could possibly be refactored
    var isJs = path.extname(original) == ".js";
    let isHtml = path.extname(original) == ".html";
    
    let href = path.relative(path.join(CWD, 'pages'), original);
    if (isJs) href = path.join(path.dirname(href), path.basename(href, '.js')) + '.html';

    const language = getLanguagePart(href);
    let targetFile = join(buildDir, href);
 
    // HTML (copy paste)
    if (isHtml && siteConfig.wrapPagesHTML) {
      const rawHtml = getPage.getPageHtml(original, language);
      writeData(join(buildDir, href), rawHtml);
    }
    
    // JS (React)
    if (isJs) {
      const rawHtml = getPage.getPageJs(original, language)
      writeData(join(buildDir, href), rawHtml);
    }
    
    let alternateLanguages = possibleLanguages.filter(alternative => alternative != language);

    // Add other languages to a list that we will execute at the end.
    var redirects = alternateLanguages.map(alternative => { 
      // replace undefined with no path;
      const alternatePart = alternative != undefined ? alternative : ''; 
      const relativity = language == undefined ? '../' : ''; 
      var fileName = join(buildDir, alternatePart, href);
      return { file: fileName, target: relativity + href, language: alternative }
    });

    redirectNeeded = redirectNeeded.concat(redirects);

    // If we don't wrap HTML files, we just copy them...
    if (!isJs && (!isHtml || !siteConfig.wrapPagesHTML))
    {
      // Static files (PNG, md, txt etc.) that happen to be in the pages folder
      copyFile(original, targetFile);
    }
  });

  redirectNeeded.forEach(info => {
    // We already have a file, we would be over-writting it.
    if (!fs.existsSync(info.file)) 
    {
      const redirectComp = (
        <Redirect
          language={info.language}
          config={siteConfig}
          redirect={info.target}
        />
      );
      const content = renderToStaticMarkup(redirectComp);

      writeData(info.file, content);
    }
  });

  // Generate CNAME file if a custom domain is specified in siteConfig
  if (siteConfig.cname) {
    let targetFile = join(buildDir, 'CNAME');
    fs.writeFileSync(targetFile, siteConfig.cname);
  }
}

module.exports = execute;
