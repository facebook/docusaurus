const fs = require('fs-extra');
const path = require('path');
const {getSubFolder, idx, parse} = require('../utils');

function getLanguage(filepath, refDir, env) {
  const translationEnabled = idx(env, ['translation', 'enabled']);
  if (translationEnabled) {
    const detectedLangTag = getSubFolder(filepath, refDir);
    const enabledLanguages = idx(env, ['translation', 'enabledLanguages']);
    const langTags =
      (enabledLanguages && enabledLanguages.map(lang => lang.tag)) || [];
    if (langTags.includes(detectedLangTag)) {
      return detectedLangTag;
    }
    const defaultLanguage = idx(env, ['translation', 'defaultLanguage']);
    if (defaultLanguage && defaultLanguage.tag) {
      return defaultLanguage.tag;
    }
  }
  return undefined;
}

function getVersion(filepath, refDir, env) {
  const versioningEnabled = idx(env, ['versioning', 'enabled']);
  if (versioningEnabled) {
    const subFolder = getSubFolder(filepath, refDir);
    if (subFolder) {
      const detectedVersion = subFolder.replace(/^version-/, '');
      const versions = idx(env, ['versioning', 'versions']) || [];
      if (versions.includes(detectedVersion)) {
        return detectedVersion;
      }
    }
    return 'next';
  }
  return undefined;
}

module.exports = async function processMetadata(source, refDir, env, order) {
  const filepath = path.resolve(refDir, source);
  const fileString = await fs.readFile(filepath, 'utf-8');
  const {metadata} = parse(fileString);

  /* source (relative to refDir) */
  metadata.source = source;

  /* default id is the file name */
  if (!metadata.id) {
    metadata.id = path.basename(source, path.extname(source));
  }
  if (metadata.id.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  /* default title is the id */
  if (!metadata.title) {
    metadata.title = metadata.id;
  }

  /* language */
  const language = getLanguage(filepath, refDir, env);
  metadata.language = language;
  const langPart = (language && `${language}/`) || '';

  /* version */
  let versionRefDir = refDir;
  if (
    language &&
    language !== idx(env, ['translation', 'defaultLanguage', 'tag'])
  ) {
    versionRefDir = path.join(refDir, language);
  }
  const version = getVersion(filepath, versionRefDir, env);
  metadata.version = version;
  const latestVersion = idx(env, ['versioning', 'latestVersion']);
  const versionPart =
    (version && version !== latestVersion && `${version}/`) || '';

  /* 
    Convert temporarily metadata.id to the form of dirname/id without version/lang prefix
    ex: file `versioned_docs/version-1.0.0/en/foo/bar.md` with id `version-1.0.0-bar` => `foo/bar`
  */
  if (language) {
    metadata.id = metadata.id.replace(new RegExp(`^${language}-`), '');
  }

  if (version) {
    metadata.id = metadata.id.replace(new RegExp(`^version-${version}-`), '');
  }

  const dirName = path.dirname(source);
  if (dirName !== '.') {
    let prefix = dirName;
    if (language) {
      prefix = prefix.replace(new RegExp(`^${language}`), '');
    }
    prefix = prefix.replace(/^\//, '');
    if (version) {
      prefix = prefix.replace(new RegExp(`^version-${version}`), '');
    }
    prefix = prefix.replace(/^\//, '');
    if (prefix) {
      metadata.id = `${prefix}/${metadata.id}`;
    }
  }

  /* Build the permalink without baseUrl */
  metadata.permalink = `docs/${langPart}${versionPart}${metadata.id}`;

  /* if version */
  if (version && version !== 'next') {
    metadata.id = `version-${version}-${metadata.id}`;
  }

  /* if language */
  if (language) {
    metadata.id = `${language}-${metadata.id}`;
  }

  /* localize id */
  metadata.localized_id = metadata.id;

  /* Determine order */
  const id = metadata.localized_id;
  if (order[id]) {
    metadata.sidebar = order[id].sidebar;
    metadata.category = order[id].category;
    if (order[id].next) {
      metadata.next_id = order[id].next;
      metadata.next = (language ? `${language}-` : '') + order[id].next;
    }
    if (order[id].previous) {
      metadata.previous_id = order[id].previous;
      metadata.previous = (language ? `${language}-` : '') + order[id].previous;
    }
  }
  return metadata;
};
