/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const {getSubFolder, idx, parse, normalizeUrl} = require('@docusaurus/utils');

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

  return null;
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

  return null;
}

module.exports = async function processMetadata(
  source,
  refDir,
  env,
  order,
  siteConfig,
  docsBasePath,
) {
  const filepath = path.resolve(refDir, source);
  const fileString = await fs.readFile(filepath, 'utf-8');
  const {metadata} = parse(fileString);

  // Default id is the file name.
  if (!metadata.id) {
    metadata.id = path.basename(source, path.extname(source));
  }
  if (metadata.id.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // Default title is the id.
  if (!metadata.title) {
    metadata.title = metadata.id;
  }

  // Language.
  const language = getLanguage(filepath, refDir, env);
  metadata.language = language;
  const langPart = (language && `${language}/`) || '';

  // Version.
  const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);
  let versionRefDir = refDir;
  if (language && language !== defaultLangTag) {
    versionRefDir = path.join(refDir, language);
  }
  const version = getVersion(filepath, versionRefDir, env);
  metadata.version = version;
  const latestVersion = idx(env, ['versioning', 'latestVersion']);
  const versionPart =
    (version && version !== latestVersion && `${version}/`) || '';

  // Convert temporarily metadata.id to the form of dirname/id without version/lang prefix.
  // e.g.: file `versioned_docs/version-1.0.0/en/foo/bar.md` with id `version-1.0.0-bar` => `foo/bar`
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

  // The docs absolute file source.
  // e.g: `/end/docs/hello.md` or `/end/website/versioned_docs/version-1.0.0/hello.md`
  metadata.source = path.join(refDir, source);

  // Build the permalink.
  const {baseUrl} = siteConfig;

  // If user has own custom permalink defined in frontmatter
  // e.g: :baseUrl:docsUrl/:langPart/:versionPart/endiliey/:id
  if (metadata.permalink) {
    metadata.permalink = path.resolve(
      metadata.permalink
        .replace(/:baseUrl/, baseUrl)
        .replace(/:docsUrl/, docsBasePath)
        .replace(/:langPart/, langPart)
        .replace(/:versionPart/, versionPart)
        .replace(/:id/, metadata.id),
    );
  } else {
    metadata.permalink = normalizeUrl([
      baseUrl,
      docsBasePath,
      langPart,
      versionPart,
      metadata.id,
    ]);
  }

  // If version.
  if (version && version !== 'next') {
    metadata.id = `version-${version}-${metadata.id}`;
  }

  // Save localized id before adding language on it.
  metadata.localized_id = metadata.id;

  // If language.
  if (language) {
    metadata.id = `${language}-${metadata.id}`;
  }

  // Determine order.
  const id = metadata.localized_id;
  if (order[id]) {
    metadata.sidebar = order[id].sidebar;
    metadata.category = order[id].category;
    metadata.subCategory = order[id].subCategory;
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
