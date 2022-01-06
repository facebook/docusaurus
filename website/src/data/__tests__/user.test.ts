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
import imageSize from 'image-size';

describe('users', () => {
  sortedUsers.forEach((user) => {
    test(user.title, () => {
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
          preview: Joi.object({})
            .unknown(false)
            .required()
            .messages({
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

  test('have valid images', async () => {
    const imageDir = path.join(__dirname, '../showcase');
    const files = await fs.readdir(imageDir);

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const {width, height} = imageSize(path.join(imageDir, file));

      expect(width!).toEqual(640);
      expect(width! / height!).toBeGreaterThanOrEqual(0.5);
    }
  });
});
