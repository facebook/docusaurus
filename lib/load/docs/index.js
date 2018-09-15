const path = require('path');
const globby = require('globby');
const createOrder = require('./order');
const loadSidebars = require('./sidebars');
const processMetadata = require('./metadata');
const {getSubFolder, idx} = require('../utils');

async function loadDocs({siteDir, docsDir, env, siteConfig}) {
  // @tested - load all sidebars including versioned sidebars
  const docsSidebars = loadSidebars({siteDir, env});

  // @tested - build the docs ordering such as next, previous, category and sidebar
  const order = createOrder(docsSidebars);

  /* Settle versions & translations from environment */
  const translationEnabled = idx(env, ['translation', 'enabled']);
  const enabledLanguages =
    translationEnabled && idx(env, ['translation', 'enabledLanguages']);
  const enabledLangTags =
    (enabledLanguages && enabledLanguages.map(lang => lang.tag)) || [];
  const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);
  const versioningEnabled = idx(env, ['versioning', 'enabled']);
  const versions =
    (versioningEnabled && idx(env, ['versioning', 'versions'])) || [];

  /* Prepare metadata container */
  const docsMetadatas = {};

  /* metadata for default docs files */
  const docsFiles = await globby(['**/*.md'], {
    cwd: docsDir
  });
  await Promise.all(
    docsFiles.map(async source => {
      /* 
        Do not allow reserved version/ translated folder name in 'docs'
        e.g: 'docs/version-1.0.0/' should not be allowed as it can cause unwanted bug
      */
      const subFolder = getSubFolder(path.resolve(docsDir, source), docsDir);
      const versionsFolders = versions.map(version => `version-${version}`);
      if ([...enabledLangTags, ...versionsFolders].includes(subFolder)) {
        throw new Error(`You cannot have a folder named 'docs/${subFolder}/'`);
      }

      const metadata = await processMetadata(
        source,
        docsDir,
        env,
        order,
        siteConfig
      );
      docsMetadatas[metadata.id] = metadata;
    })
  );

  /* metadata for non-default-language docs */
  const translatedDir = path.join(siteDir, 'translated_docs');
  const translatedFiles = await globby(['**/*.md'], {
    cwd: translatedDir
  });
  await Promise.all(
    translatedFiles.map(async source => {
      /* 
        Do not process disabled & default languages folder in `translated_docs`
        e.g: 'translated_docs/ja/**' should not be processed if lang 'ja' is disabled
      */
      const translatedFilePath = path.resolve(translatedDir, source);
      const detectedLangTag = getSubFolder(translatedFilePath, translatedDir);
      if (
        detectedLangTag === defaultLangTag ||
        !enabledLangTags.includes(detectedLangTag)
      ) {
        return;
      }

      const metadata = await processMetadata(
        source,
        translatedDir,
        env,
        order,
        siteConfig
      );
      docsMetadatas[metadata.id] = metadata;
    })
  );

  /* metadata for versioned docs */
  const versionedDir = path.join(siteDir, 'versioned_docs');
  const versionedFiles = await globby(['**/*.md'], {
    cwd: versionedDir
  });
  await Promise.all(
    versionedFiles.map(async source => {
      const metadata = await processMetadata(
        source,
        versionedDir,
        env,
        order,
        siteConfig
      );
      docsMetadatas[metadata.id] = metadata;
    })
  );

  /* Get the titles of the previous and next ids so that we can use them */
  Object.keys(docsMetadatas).forEach(currentID => {
    const previousID = idx(docsMetadatas, [currentID, 'previous']);
    if (previousID) {
      const previousTitle = idx(docsMetadatas, [previousID, 'title']);
      docsMetadatas[currentID].previous_title = previousTitle || 'Previous';
    }
    const nextID = idx(docsMetadatas, [currentID, 'next']);
    if (nextID) {
      const nextTitle = idx(docsMetadatas, [nextID, 'title']);
      docsMetadatas[currentID].next_title = nextTitle || 'Next';
    }
  });

  return {
    docsSidebars,
    docsMetadatas
  };
}

module.exports = loadDocs;
