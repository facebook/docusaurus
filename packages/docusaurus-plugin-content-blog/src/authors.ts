/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import {Author, BlogContentPaths} from './types';
import {findFolderContainingFile} from '@docusaurus/utils';
import {Joi, URISchema} from '@docusaurus/utils-validation';
import {
  BlogPostFrontMatter,
  BlogPostFrontMatterAuthor,
  BlogPostFrontMatterAuthors,
} from './blogFrontMatter';
import {getContentPathList} from './blogUtils';
import Yaml from 'js-yaml';

export type AuthorsMap = Record<string, Author>;

const AuthorsMapSchema = Joi.object<AuthorsMap>().pattern(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
    url: URISchema,
    imageURL: URISchema,
    title: Joi.string(),
  })
    .rename('image_url', 'imageURL')
    .unknown()
    .required(),
);

export function validateAuthorsMapFile(content: unknown): AuthorsMap {
  return Joi.attempt(content, AuthorsMapSchema);
}

export async function readAuthorsMapFile(
  filePath: string,
): Promise<AuthorsMap | undefined> {
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
      // TODO replace later by error cause: see https://v8.dev/features/error-cause
      console.error(chalk.red('The author list file looks invalid!'));
      throw e;
    }
  }
  return undefined;
}

type AuthorsMapParams = {
  authorsMapPath: string;
  contentPaths: BlogContentPaths;
};

export async function getAuthorsMapFilePath({
  authorsMapPath,
  contentPaths,
}: AuthorsMapParams): Promise<string | undefined> {
  // Useful to load an eventually localize authors map
  const contentPath = await findFolderContainingFile(
    getContentPathList(contentPaths),
    authorsMapPath,
  );

  if (contentPath) {
    return path.join(contentPath, authorsMapPath);
  }

  return undefined;
}

export async function getAuthorsMap(
  params: AuthorsMapParams,
): Promise<AuthorsMap | undefined> {
  const filePath = await getAuthorsMapFilePath(params);
  if (!filePath) {
    return undefined;
  }
  try {
    return await readAuthorsMapFile(filePath);
  } catch (e) {
    // TODO replace later by error cause, see https://v8.dev/features/error-cause
    console.error(
      chalk.red(`Couldn't read blog authors map at path ${filePath}`),
    );
    throw e;
  }
}

type AuthorsParam = {
  frontMatter: BlogPostFrontMatter;
  authorsMap: AuthorsMap | undefined;
};

// Legacy v1/early-v2 frontmatter fields
// We may want to deprecate those in favor of using only frontMatter.authors
function getFrontMatterAuthorLegacy(
  frontMatter: BlogPostFrontMatter,
): BlogPostFrontMatterAuthor | undefined {
  const name = frontMatter.author;
  const title = frontMatter.author_title ?? frontMatter.authorTitle;
  const url = frontMatter.author_url ?? frontMatter.authorURL;
  const imageURL = frontMatter.author_image_url ?? frontMatter.authorImageURL;

  // Shouldn't we require at least an author name?
  if (name || title || url || imageURL) {
    return {
      name,
      title,
      url,
      imageURL,
    };
  }

  return undefined;
}

function normalizeFrontMatterAuthors(
  frontMatterAuthors: BlogPostFrontMatterAuthors = [],
): BlogPostFrontMatterAuthor[] {
  function normalizeAuthor(
    authorInput: string | BlogPostFrontMatterAuthor,
  ): BlogPostFrontMatterAuthor {
    if (typeof authorInput === 'string') {
      // Technically, we could allow users to provide an author's name here
      // IMHO it's better to only support keys here
      // Reason: a typo in a key would fallback to becoming a name and may end-up un-noticed
      return {key: authorInput};
    }
    return authorInput;
  }

  return Array.isArray(frontMatterAuthors)
    ? frontMatterAuthors.map(normalizeAuthor)
    : [normalizeAuthor(frontMatterAuthors)];
}

function getFrontMatterAuthors(params: AuthorsParam): Author[] {
  const {authorsMap} = params;
  const frontMatterAuthors = normalizeFrontMatterAuthors(
    params.frontMatter.authors,
  );

  function getAuthorsMapAuthor(key: string | undefined): Author | undefined {
    if (key) {
      if (!authorsMap || Object.keys(authorsMap).length === 0) {
        throw new Error(`Can't reference blog post authors by a key (such as '${key}') because no authors map file could be loaded.
Please double-check your blog plugin config (in particular 'authorsMapPath'), ensure the file exists at the configured path, is not empty, and is valid!`);
      }
      const author = authorsMap[key];
      if (!author) {
        throw Error(`Blog author with key "${key}" not found in the authors map file.
Valid author keys are:
${Object.keys(authorsMap)
  .map((validKey) => `- ${validKey}`)
  .join('\n')}`);
      }
      return author;
    }
    return undefined;
  }

  function toAuthor(frontMatterAuthor: BlogPostFrontMatterAuthor): Author {
    return {
      // Author def from authorsMap can be locally overridden by frontmatter
      ...getAuthorsMapAuthor(frontMatterAuthor.key),
      ...frontMatterAuthor,
    };
  }

  return frontMatterAuthors.map(toAuthor);
}

export function getBlogPostAuthors(params: AuthorsParam): Author[] {
  const authorLegacy = getFrontMatterAuthorLegacy(params.frontMatter);
  const authors = getFrontMatterAuthors(params);

  if (authorLegacy) {
    // Technically, we could allow mixing legacy/authors frontmatter, but do we really want to?
    if (authors.length > 0) {
      throw new Error(
        `To declare blog post authors, use the 'authors' FrontMatter in priority.
Don't mix 'authors' with other existing 'author_*' FrontMatter. Choose one or the other, not both at the same time.`,
      );
    }
    return [authorLegacy];
  }

  return authors;
}
