/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TagList, sortedUsers, type User} from '../users';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Joi} from '@docusaurus/utils-validation';

import fs from 'fs-extra';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import imageSize from 'image-size';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveGoodDimensions: () => R;
    }
  }
}

expect.extend({
  toHaveGoodDimensions({width, height}: {width: number; height: number}) {
    // Put this one first because aspect ratio is harder to fix than resizing
    // (need to take another screenshot)
    if (width / height > 2) {
      return {
        pass: false,
        message: () =>
          `The preview image's width is ${width} and height is ${height}. To make sure it takes up the entire container in our showcase card, it needs to have an aspect ratio of no wider than 2:1. Please make your image taller.`,
      };
    } else if (width < 640) {
      return {
        pass: false,
        message: () =>
          `The preview image's width is ${width}, but we require a minimum 640. You can either resize it locally, or you can wait for the maintainer to resize it for you.`,
      };
    }
    return {
      pass: true,
      message: () => "The preview image's dimensions are good",
    };
  },
});

describe('users', () => {
  sortedUsers.forEach((user) => {
    test(user.title, async () => {
      Joi.attempt(
        user,
        Joi.object<User>({
          title: Joi.string().required(),
          description: Joi.string().required(),
          website: Joi.string()
            .pattern(/^https?:\/\//)
            .message('')
            .required(),
          // The preview should be jest/emptyModule
          preview: Joi.object({}).unknown(false).required().messages({
            'object.base':
              'The image should be hosted on Docusaurus site, and not use remote HTTP or HTTPS URLs. It must be imported with require().',
          }),
          tags: Joi.array()
            .items(...TagList)
            .required(),
          source: Joi.string().allow(null).required().messages({
            'any.required':
              "The source attribute is required.\nIf your Docusaurus site is not open-source, please make it explicit with 'source: null'.",
          }),
        }).unknown(false),
      );
      if (user.tags.includes('opensource') && user.source === null) {
        throw new Error(
          "You can't add the 'opensource' tag to a site that does not have a link to source code. Please add your source code, or remove this tag.",
        );
      } else if (user.source !== null && !user.tags.includes('opensource')) {
        throw new Error(
          "For open-source sites, please add the 'opensource' tag.",
        );
      }
    });
  });

  const imageDir = path.join(__dirname, '../showcase');
  // eslint-disable-next-line no-restricted-properties
  const files = fs
    .readdirSync(imageDir)
    .filter((file) => ['.png', 'jpg', '.jpeg'].includes(path.extname(file)));

  files.forEach((file) => {
    test(file, () => {
      const size = imageSize(path.join(imageDir, file));

      expect(size).toHaveGoodDimensions();
    });
  });
});
