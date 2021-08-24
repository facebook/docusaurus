/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import {pickBy, identity} from 'lodash';
import {Author, BlogContentPaths} from './types';
import {getFolderContainingFile} from '@docusaurus/utils';
import {Joi, URISchema} from '@docusaurus/utils-validation';
import {BlogPostFrontMatter} from './blogFrontMatter';
import {getContentPathList} from './blogUtils';
import Yaml from 'js-yaml';

export type AuthorsMap = Record<string, Author>;

async function readAuthorsMapFile(
  filePath: string,
): Promise<AuthorsMap | undefined> {
  const AuthorsMapSchema = Joi.object<AuthorsMap>().pattern(
    Joi.string(),
    Joi.object({
      name: Joi.string(),
      url: URISchema,
      imageURL: URISchema,
      title: Joi.string(),
    })
      .rename('image_url', 'imageURL')
      .unknown(),
  );

  function validateAuthorsMapFile(content: unknown): AuthorsMap {
    return Joi.attempt(content, AuthorsMapSchema);
  }

  if (await fs.pathExists(filePath)) {
    const contentString = await fs.readFile(filePath, {encoding: 'utf8'});
    const parse =
      filePath.endsWith('.yml') || filePath.endsWith('.yaml')
        ? Yaml.load
        : JSON.parse;
    try {
      const unsafeContent = parse(contentString);
      return validateAuthorsMapFile(unsafeContent);
    } catch (e) {
      console.error(chalk.red('The author list file looks invalid!'));
      throw e;
    }
  }
  return undefined;
}

export async function getAuthorsMap(
  contentPaths: BlogContentPaths,
  filePath: string,
): Promise<AuthorsMap | undefined> {
  async function getAuthorsMapFilePath() {
    try {
      return await getFolderContainingFile(
        getContentPathList(contentPaths),
        filePath,
      );
    } catch {
      return undefined;
    }
  }
  const authorsMapDir = await getAuthorsMapFilePath();
  if (!authorsMapDir) {
    return undefined;
  }
  return readAuthorsMapFile(path.join(authorsMapDir, filePath));
}

function normalizeAuthor(
  frontMatter: BlogPostFrontMatter,
): Pick<BlogPostFrontMatter, 'author_keys' | 'authors'> {
  /* eslint-disable camelcase */
  const {
    author,
    authors,
    author_key,
    author_keys,
    author_title,
    author_url,
    author_image_url,
    authorTitle,
    authorURL,
    authorImageURL,
  } = frontMatter;
  if (
    typeof author === 'string' ||
    (typeof author === 'undefined' &&
      (author_title ||
        author_url ||
        author_image_url ||
        authorTitle ||
        authorURL ||
        authorImageURL ||
        author_key))
  ) {
    return {
      author_keys: author_key ? [author_key] : undefined,
      authors: [
        {
          name: author,
          title: author_title || authorTitle,
          url: author_url || authorURL,
          imageURL: author_image_url || authorImageURL,
        },
      ],
    };
  }
  if (author) {
    // TODO: not optimal, but seems the image_url is not transformed during validation
    if (author.image_url) {
      author.imageURL = author.image_url as string;
      delete author.image_url;
    }
    return {
      author_keys: author_key ? [author_key] : undefined,
      authors: [author],
    };
  }
  authors?.forEach((authorInList) => {
    if (authorInList?.image_url) {
      authorInList.imageURL = authorInList.image_url as string;
      delete authorInList.image_url;
    }
  });
  return {
    author_keys,
    authors: authors || [],
  };
  /* eslint-enable camelcase */
}

export function getBlogPostAuthors(
  authorsMap: AuthorsMap | undefined,
  frontMatter: BlogPostFrontMatter,
): Author[] {
  const {
    author_keys: authorKeys,
    authors: frontMatterAuthors,
  } = normalizeAuthor(frontMatter);
  let authors: Author[] = [];
  if (authorKeys) {
    if (!authorsMap) {
      throw Error(
        `The "author_key" front matter is used but no author list file is found.`,
      );
    }
    authors = authorKeys.map((key) => {
      if (!authorsMap[key]) {
        throw Error(`Author with key "${key}" not found in the list file. Available keys are:
${Object.keys(authorsMap)
  .map((validKey) => `- ${validKey}`)
  .join('\n')}`);
      }
      return authorsMap[key];
    });
  }
  if (frontMatterAuthors) {
    authors = frontMatterAuthors.map((author, index) => {
      if (index < authors.length) {
        return {
          ...pickBy(authors[index], identity()),
          ...pickBy(author, identity()),
        };
      }
      return author;
    });
  }
  return authors;
}
