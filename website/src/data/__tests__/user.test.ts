/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TagList, User, sortedUsers} from '../users';
import {difference} from '@site/src/utils/jsUtils';

import fs from 'fs-extra';
import path from 'path';
import imageSize from 'image-size';

describe('users', () => {
  test('are valid', () => {
    sortedUsers.forEach(ensureUserValid);
  });

  test('have valid images', async () => {
    const minCardImageWidth = 304;
    const minCardImageHeight = 150;
    const minCardImageHeightScaled = 140;
    const imageDir = path.join(__dirname, '../showcase');

    const files = await fs.readdir(imageDir);

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const size = imageSize(path.join(imageDir, file));

      if (size.width! < minCardImageWidth) {
        throw new Error(
          `Image width should be >= ${minCardImageWidth}
Image=${file}`,
        );
      }
      if (size.height! < minCardImageHeight) {
        throw new Error(
          `Image height should be >= ${minCardImageHeight}
Image=${file}`,
        );
      }

      const scaledHeight = size.height! / (size.width! / minCardImageWidth);
      if (scaledHeight < minCardImageHeightScaled) {
        throw new Error(
          `Image height is too small compared to width
After downscaling to width=${minCardImageWidth}, height would be ${scaledHeight} while the minimum is ${minCardImageHeightScaled}
Image=${file}`,
        );
      }
    }
  });
});

// TODO, refactor legacy test code
// Fail-fast on common errors
function ensureUserValid(user: User) {
  function checkFields() {
    const keys = Object.keys(user);
    const validKeys = [
      'title',
      'description',
      'preview',
      'website',
      'source',
      'tags',
    ];
    const unknownKeys = difference(keys, validKeys);
    if (unknownKeys.length > 0) {
      throw new Error(
        `Site contains unknown attribute names=[${unknownKeys.join(',')}]`,
      );
    }
  }

  function checkTitle() {
    if (!user.title) {
      throw new Error('Site title is missing');
    }
  }

  function checkDescription() {
    if (!user.description) {
      throw new Error('Site description is missing');
    }
  }

  function checkWebsite() {
    if (!user.website) {
      throw new Error('Site website is missing');
    }
    const isHttpUrl =
      user.website.startsWith('http://') || user.website.startsWith('https://');
    if (!isHttpUrl) {
      throw new Error(
        `Site website does not look like a valid url: ${user.website}`,
      );
    }
  }

  function checkPreview() {
    if (
      !user.preview ||
      (user.preview instanceof String &&
        (user.preview.startsWith('http') || user.preview.startsWith('//')))
    ) {
      throw new Error(
        `Site has bad image preview=[${user.preview}].\nThe image should be hosted on Docusaurus site, and not use remote HTTP or HTTPS URLs`,
      );
    }
  }

  function checkTags() {
    if (
      !user.tags ||
      !(user.tags instanceof Array) ||
      (user.tags as string[]).includes('')
    ) {
      throw new Error(`Bad showcase tags=[${JSON.stringify(user.tags)}]`);
    }
    const unknownTags = difference(user.tags, TagList);
    if (unknownTags.length > 0) {
      throw new Error(
        `Unknown tags=[${unknownTags.join(
          ',',
        )}\nThe available tags are ${TagList.join(',')}`,
      );
    }
  }

  function checkOpenSource() {
    if (typeof user.source === 'undefined') {
      throw new Error(
        "The source attribute is required.\nIf your Docusaurus site is not open-source, please make it explicit with 'source: null'",
      );
    } else {
      const hasOpenSourceTag = user.tags.includes('opensource');
      if (user.source === null && hasOpenSourceTag) {
        throw new Error(
          "You can't add the opensource tag to a site that does not have a link to source code.",
        );
      } else if (user.source && !hasOpenSourceTag) {
        throw new Error(
          "For open-source sites, please add the 'opensource' tag",
        );
      }
    }
  }

  try {
    checkFields();
    checkTitle();
    checkDescription();
    checkWebsite();
    checkPreview();
    checkTags();
    checkOpenSource();
  } catch (e) {
    throw new Error(
      `Showcase site with title=${user.title} contains errors:\n${
        (e as Error).message
      }`,
    );
  }
}
