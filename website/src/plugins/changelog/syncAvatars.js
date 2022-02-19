/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable import/no-extraneous-dependencies */

// @ts-check

const path = require('path');
const fs = require('fs-extra');
// const axios = require('axios').default;

// TODO not sure how the syncing should be done at all... for now it always
// pretends the limit is reached. We should only fetch a portion of the avatars
// at a time. But seems avatars.githubusercontent.com API doesn't like HTTP
// requests?
/**
 * @param {string} username
 * @param {Record<string, number>} lastUpdateCache
 * @param {Record<string, {imageURL: string; url: string}>} authorsMap
 * @returns true if saved successfully (including not found); false if limit
 * reached
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchImage(username, lastUpdateCache, authorsMap) {
  return false;
}

/**
 * We need to keep track of all committers that are in the changelog, and fetch
 * their avatars beforehand. This prevents sending too many requests to GitHub
 * every time one visits a page. Avatar refreshing is done incrementally across
 * each build.
 *
 * This method mutates the authorsMap. If the avatar fails to be fetched, the
 * imageURL is re-written with the github remote URL. The authors map is then
 * written to FS.
 *
 * @param {Record<string, {name: string, url: string, alias: string, imageURL: string}>} authorsMap
 * @param {string} generateDir
 */
async function syncAvatars(authorsMap, generateDir) {
  const imagePath = path.join(generateDir, 'img');
  const lastUpdateCachePath = path.join(imagePath, 'lastUpdate.json');
  const authorsPath = path.join(generateDir, 'authors.json');
  if (!(await fs.pathExists(lastUpdateCachePath))) {
    await fs.outputFile(lastUpdateCachePath, '{}');
  }
  /**
   * Records the last time an avatar was successfully updated.
   * If an entry doesn't exist, the file won't exist either.
   * @type {Record<string, number>}
   */
  const lastUpdateCache = await fs.readJSON(lastUpdateCachePath);
  let limitReached = false;
  for (const username of Object.keys(authorsMap)) {
    if (!limitReached && !lastUpdateCache[username]) {
      if (!(await fetchImage(username, lastUpdateCache, authorsMap))) {
        limitReached = true;
      }
    }
    if (limitReached) {
      authorsMap[username].imageURL = `https://github.com/${username}.png`;
    }
  }
  const usersByLastUpdate = Object.entries(lastUpdateCache)
    .sort((a, b) => a[1] - b[1])
    .map((a) => a[0]);
  for (const username of usersByLastUpdate) {
    if (
      !limitReached &&
      lastUpdateCache[username] < Date.now() - 24 * 3600 * 1000
    ) {
      if (!(await fetchImage(username, lastUpdateCache, authorsMap))) {
        break;
      }
    }
  }
  await fs.outputFile(
    lastUpdateCachePath,
    JSON.stringify(lastUpdateCache, null, 2),
  );
  await fs.outputFile(authorsPath, JSON.stringify(authorsMap, null, 2));
}

module.exports = syncAvatars;
