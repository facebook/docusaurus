/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {getDataFileData, normalizeUrl} from '@docusaurus/utils';
import {Joi, URISchema} from '@docusaurus/utils-validation';
import type {BlogContentPaths} from './types';
import type {
  Author,
  AuthorAttributes,
  AuthorPage,
} from '@docusaurus/plugin-content-blog';

export type AuthorsMap = {[authorKey: string]: Author};

type AuthorInput = AuthorAttributes & {
  page: boolean | AuthorPage;
};

type AuthorsMapInput = {[authorKey: string]: AuthorInput};

const AuthorPageSchema = Joi.object<AuthorPage>({
  permalink: Joi.string().required(),
});

const AuthorsMapInputSchema = Joi.object<AuthorsMapInput>()
  .pattern(
    Joi.string(),
    Joi.object({
      name: Joi.string(),
      url: URISchema,
      imageURL: URISchema,
      title: Joi.string(),
      email: Joi.string(),
      page: Joi.alternatives(Joi.bool(), AuthorPageSchema),
      permalink: Joi.string(),
      description: Joi.string(),
    })
      .rename('image_url', 'imageURL')
      .or('name', 'imageURL')
      .unknown()
      .required()
      .messages({
        'object.base':
          '{#label} should be an author object containing properties like name, title, and imageURL.',
        'any.required':
          '{#label} cannot be undefined. It should be an author object containing properties like name, title, and imageURL.',
      }),
  )
  .messages({
    'object.base':
      "The authors map file should contain an object where each entry contains an author key and the corresponding author's data.",
  });

export function checkPermalinkCollisions(
  authorsMap: AuthorsMap | undefined,
): void {
  const pageAuthorsMap = _.pickBy(authorsMap, (author) => !!author.page);

  const permalinkCounts: {[key: string]: string[]} = {};
  for (const [key, author] of Object.entries(pageAuthorsMap)) {
    if (author.page) {
      const {permalink} = author.page;
      if (!permalinkCounts[permalink]) {
        permalinkCounts[permalink] = [];
      }
      permalinkCounts[permalink]?.push(author.name || key);
    }
  }

  const collisions = Object.entries(permalinkCounts).filter(
    ([, authors]) => authors.length > 1,
  );

  if (collisions.length > 0) {
    let errorMessage = 'The following permalinks are duplicated:\n';

    collisions.forEach(([permalink, authors]) => {
      errorMessage += `Permalink: ${permalink}\nAuthors: ${authors.join(', ')}`;
    });

    throw new Error(errorMessage);
  }
}

function normalizeAuthor({
  authorsBaseRoutePath,
  authorKey,
  author,
}: {
  authorsBaseRoutePath: string;
  authorKey: string;
  author: AuthorInput;
}): Author {
  const name = author.name || authorKey;

  function getAuthorPage(): AuthorPage | null {
    if (!author.page) {
      return null;
    }
    const slug =
      author.page === true ? _.kebabCase(authorKey) : author.page.permalink;
    return {
      permalink: normalizeUrl([authorsBaseRoutePath, slug]),
    };
  }

  return {
    key: authorKey,
    page: getAuthorPage(),
    name,
    imageURL: author.imageURL,
    url: author.url,
    title: author.title,
    email: author.email,
    description: author.description,
  };
}

function normalizeAuthorsMap({
  authorsBaseRoutePath,
  authorsMapInput,
}: {
  authorsBaseRoutePath: string;
  authorsMapInput: AuthorsMapInput;
}): AuthorsMap {
  return _.mapValues(authorsMapInput, (author, authorKey) => {
    return normalizeAuthor({authorsBaseRoutePath, authorKey, author});
  });
}

function validateAuthorsMapInput(content: unknown): AuthorsMapInput {
  const {error, value} = AuthorsMapInputSchema.validate(content);
  if (error) {
    throw error;
  }
  return value;
}

async function getAuthorsMapInput(params: {
  authorsMapPath: string;
  contentPaths: BlogContentPaths;
}): Promise<AuthorsMapInput | undefined> {
  return getDataFileData(
    {
      filePath: params.authorsMapPath,
      contentPaths: params.contentPaths,
      fileType: 'authors map',
    },
    validateAuthorsMapInput,
  );
}

export async function getAuthorsMap(params: {
  authorsMapPath: string;
  authorsBaseRoutePath: string;
  contentPaths: BlogContentPaths;
}): Promise<AuthorsMap | undefined> {
  const authorsMapInput = await getAuthorsMapInput(params);
  if (!authorsMapInput) {
    return undefined;
  }
  const authorsMap = normalizeAuthorsMap({authorsMapInput, ...params});
  checkPermalinkCollisions(authorsMap);
  return authorsMap;
}
