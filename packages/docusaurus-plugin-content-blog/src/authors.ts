/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {getDataFileData, normalizeUrl} from '@docusaurus/utils';
import {Joi, URISchema} from '@docusaurus/utils-validation';
import {paginateBlogPosts} from './blogUtils';
import type {BlogContentPaths} from './types';
import type {
  Author,
  BlogPageAuthors,
  BlogPost,
  BlogPostFrontMatter,
  BlogPostFrontMatterAuthor,
  BlogPostFrontMatterAuthors,
  PageAuthor,
} from '@docusaurus/plugin-content-blog';

export type AuthorsMap = {[authorKey: string]: Author};

const AuthorsMapSchema = Joi.object<AuthorsMap>()
  .pattern(
    Joi.string(),
    Joi.object({
      name: Joi.string(),
      url: URISchema,
      imageURL: URISchema,
      title: Joi.string(),
      email: Joi.string(),
      generateAuthorPage: Joi.bool(),
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

export function validateAuthorsMap(content: unknown): AuthorsMap {
  const {error, value} = AuthorsMapSchema.validate(content);
  if (error) {
    throw error;
  }
  return value;
}

export async function getAuthorsMap(params: {
  authorsMapPath: string;
  contentPaths: BlogContentPaths;
}): Promise<AuthorsMap | undefined> {
  return getDataFileData(
    {
      filePath: params.authorsMapPath,
      contentPaths: params.contentPaths,
      fileType: 'authors map',
    },
    validateAuthorsMap,
  );
}

type AuthorsParam = {
  frontMatter: BlogPostFrontMatter;
  authorsMap: AuthorsMap | undefined;
  baseUrl: string;
};

function normalizeImageUrl({
  imageURL,
  baseUrl,
}: {
  imageURL: string | undefined;
  baseUrl: string;
}) {
  return imageURL?.startsWith('/')
    ? normalizeUrl([baseUrl, imageURL])
    : imageURL;
}

// Legacy v1/early-v2 front matter fields
// We may want to deprecate those in favor of using only frontMatter.authors
function getFrontMatterAuthorLegacy({
  baseUrl,
  frontMatter,
}: {
  baseUrl: string;
  frontMatter: BlogPostFrontMatter;
}): Author | undefined {
  const name = frontMatter.author;
  const title = frontMatter.author_title ?? frontMatter.authorTitle;
  const url = frontMatter.author_url ?? frontMatter.authorURL;
  const imageURL = normalizeImageUrl({
    imageURL: frontMatter.author_image_url ?? frontMatter.authorImageURL,
    baseUrl,
  });

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
    authorInput: string | Author,
  ): BlogPostFrontMatterAuthor {
    if (typeof authorInput === 'string') {
      // Technically, we could allow users to provide an author's name here, but
      // we only support keys, otherwise, a typo in a key would fallback to
      // becoming a name and may end up unnoticed
      return {key: authorInput};
    }
    return authorInput;
  }

  return Array.isArray(frontMatterAuthors)
    ? frontMatterAuthors.map(normalizeAuthor)
    : [normalizeAuthor(frontMatterAuthors)];
}

function getFrontMatterAuthors(params: AuthorsParam): Author[] {
  const {authorsMap, baseUrl} = params;
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
    const author = {
      // Author def from authorsMap can be locally overridden by front matter
      ...getAuthorsMapAuthor(frontMatterAuthor.key),
      ...frontMatterAuthor,
    };

    return {
      ...author,
      imageURL: normalizeImageUrl({imageURL: author.imageURL, baseUrl}),
    };
  }

  return frontMatterAuthors.map(toAuthor);
}

export function getBlogPostAuthors(params: AuthorsParam): Author[] {
  const authorLegacy = getFrontMatterAuthorLegacy(params);
  const authors = getFrontMatterAuthors(params);

  if (authorLegacy) {
    // Technically, we could allow mixing legacy/authors front matter, but do we
    // really want to?
    if (authors.length > 0) {
      throw new Error(
        `To declare blog post authors, use the 'authors' front matter in priority.
Don't mix 'authors' with other existing 'author_*' front matter. Choose one or the other, not both at the same time.`,
      );
    }
    return [authorLegacy];
  }

  return authors;
}

export function checkPermalinkCollisions(
  authorsMap: AuthorsMap | undefined,
): void {
  const pageAuthorsMap = _.pickBy(
    authorsMap,
    (author) => author.generateAuthorPage === true,
  );

  const permalinkCounts: {[key: string]: string[]} = {};

  for (const [key, author] of Object.entries(pageAuthorsMap)) {
    const permalink = normalizeUrl(['/', author.permalink || key, '/']);
    if (!permalinkCounts[permalink]) {
      permalinkCounts[permalink] = [];
    }
    permalinkCounts[permalink]?.push(author.name || key);
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

function normalizePageAuthor({
  authorsBaseRoutePath,
  author,
}: {
  authorsBaseRoutePath: string;
  author: Author;
}): PageAuthor {
  const key = author.key as string;
  const name = author.name || key;
  const permalink = author.permalink || _.kebabCase(key);

  return {
    imageURL: author.imageURL ?? '',
    url: author.url,
    title: author.title,
    email: author.email,
    description: author.description,
    name,
    key,
    permalink: normalizeUrl([authorsBaseRoutePath, permalink]),
  };
}

export function normalizePageAuthors({
  authorsBaseRoutePath,
  authors,
}: {
  authorsBaseRoutePath: string;
  authors: Author[] | undefined;
}): PageAuthor[] {
  return (authors ?? [])
    .filter((author) => author.generateAuthorPage)
    .map((author) => normalizePageAuthor({authorsBaseRoutePath, author}));
}

type AuthoredItemGroup<Item> = {
  author: PageAuthor;
  items: Item[];
};

/**
 * Permits to group docs/blog posts by author (provided by front matter).
 *
 * @returns a map from author permalink to the items and other relevant author
 * data.
 * The record is indexed by permalink, because routes must be unique in the end.
 * Labels may vary on 2 MD files but they are normalized. Docs with
 * label='some label' and label='some-label' should end up in the same page.
 */
export function groupAuthoredItems<Item>(
  items: readonly Item[],
  /**
   * A callback telling me how to get the authors list of the current item.
   * Usually simply getting it from some metadata of the current item.
   */
  getItemPageAuthors: (item: Item) => readonly PageAuthor[],
): {[permalink: string]: AuthoredItemGroup<Item>} {
  const result: {[permalink: string]: AuthoredItemGroup<Item>} = {};

  items.forEach((item) => {
    getItemPageAuthors(item).forEach((author) => {
      // Init missing author groups
      // TODO: it's not really clear what should be the behavior if 2
      // authors have the same permalink but the label is different for each
      // For now, the first author found wins
      result[author.permalink] ??= {
        author,
        items: [],
      };

      // Add item to group
      result[author.permalink]!.items.push(item);
    });
  });

  // If user add twice the same author to a md doc (weird but possible),
  // we don't want the item to appear twice in the list...
  // TODO wait for #10224 and remove below code
  Object.values(result).forEach((group) => {
    group.items = _.uniq(group.items);
  });

  return result;
}

/**
 * Permits to get the "author visibility" (hard to find a better name)
 * IE, is this author listed or unlisted
 * And which items should be listed when this author is browsed
 */
export function getAuthorVisibility<Item>({
  items,
  isUnlisted,
}: {
  items: Item[];
  isUnlisted: (item: Item) => boolean;
}): {
  unlisted: boolean;
  listedItems: Item[];
} {
  const allItemsUnlisted = items.every(isUnlisted);
  // When a author is full of unlisted items, we display all the items
  // when author is browsed, but we mark the author as unlisted
  if (allItemsUnlisted) {
    return {unlisted: true, listedItems: items};
  }
  // When a author has some listed items, the author remains listed
  // but we filter its unlisted items
  return {
    unlisted: false,
    listedItems: items.filter((item) => !isUnlisted(item)),
  };
}

export function getBlogPageAuthors({
  blogPosts,
  ...params
}: {
  blogPosts: BlogPost[];
  blogTitle: string;
  blogDescription: string;
  postsPerPageOption: number | 'ALL';
  pageBasePath: string;
}): BlogPageAuthors {
  const getPostPageAuthors = (blogPost: BlogPost) =>
    blogPost.metadata.pageAuthors;

  const groups = groupAuthoredItems(blogPosts, getPostPageAuthors);

  return _.mapValues(groups, ({author, items: authorBlogPosts}) => {
    const authorVisibility = getAuthorVisibility({
      items: authorBlogPosts,
      isUnlisted: (item: BlogPost) => item.metadata.unlisted,
    });
    return {
      ...author,
      items: authorVisibility.listedItems.map((item: BlogPost) => item.id),
      pages: author.permalink
        ? paginateBlogPosts({
            blogPosts: authorVisibility.listedItems,
            basePageUrl: author.permalink,
            ...params,
          })
        : [],
      unlisted: authorVisibility.unlisted,
    };
  });
}
