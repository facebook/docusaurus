/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {normalizeUrl} from './urlUtils';

export type Author = {
  /**
   * If `name` doesn't exist, an `imageURL` is expected.
   */
  name?: string;
  /**
   * The image path could be collocated, in which case
   * `metadata.assets.authorsImageUrls` should be used instead. If `imageURL`
   * doesn't exist, a `name` is expected.
   */
  imageURL?: string;
  /**
   * Used to generate the author's link.
   */
  url?: string;
  /**
   * Used as a subtitle for the author, e.g. "maintainer of Docusaurus"
   */
  title?: string;
  /**
   * Mainly used for RSS feeds; if `url` doesn't exist, `email` can be used
   * to generate a fallback `mailto:` URL.
   */
  email?: string;
  /**
   * Unknown keys are allowed, so that we can pass custom fields to authors,
   * e.g., `twitter`.
   */
  [key: string]: unknown;
};

export type PageAuthor = {
  /** User name */
  name: string;
  /** Permalink to this author's page, without the `/authors/` base path. */
  permalink: string;

  title: string | undefined;
  email: string | undefined;
  url: string | undefined;
};

/** What the authors list page should know about each author. */
export type AuthorsListItem = PageAuthor & {
  /** Number of posts/docs with this author. */
  count: number;
};

/** What the author's own page should know about the author. */
export type AuthorModule = AuthorsListItem & {
  /** The authors list page's permalink. */
  allAuthorsPath: string;
  /** Is this author unlisted? (when it only contains unlisted items) */
  unlisted: boolean;
};

// We always apply tagsBaseRoutePath on purpose. For versioned docs, v1/doc.md
// and v2/doc.md tags with custom permalinks don't lead to the same created
// page. tagsBaseRoutePath is different for each doc version
function normalizeAuthorPermalink({
  authorsBaseRoutePath,
  permalink,
}: {
  authorsBaseRoutePath: string;
  permalink: string;
}): string {
  return normalizeUrl([authorsBaseRoutePath, permalink]);
}

function normalizeFrontMatterAuthor(
  authorsPath: string,
  frontMatterPageAuthor: PageAuthor,
): PageAuthor {
  function toPageAuthorObject(authorString: string): PageAuthor {
    return {
      name: authorString,
      permalink: _.kebabCase(authorString),
      url: undefined,
      title: undefined,
      email: undefined,
    };
  }

  const author: PageAuthor =
    typeof frontMatterPageAuthor === 'string'
      ? toPageAuthorObject(frontMatterPageAuthor)
      : frontMatterPageAuthor;

  return {
    name: author.name,
    permalink: normalizeAuthorPermalink({
      permalink: author.permalink,
      authorsBaseRoutePath: authorsPath,
    }),
    url: author.url,
    title: author.title,
    email: author.email,
  };
}

/**
 * Takes author objects as they are defined in front matter, and normalizes each
 * into a standard author object. The permalink is created by appending the
 * sluggified label to `authorsPath`. Front matter authors already containing
 * permalinks would still have `authorsPath` prepended.
 *
 * The result will always be unique by permalinks. The behavior with colliding
 * permalinks is undetermined.
 */
export function normalizeFrontMatterPageAuthors(
  /** Base path to append the author permalinks to. */
  authorsBaseRoutePath: string,
  /** Can be `undefined`, so that we can directly pipe in
   * `frontMatter.authors`. */
  frontMatterPageAuthors: Author[] | undefined = [],
): PageAuthor[] {
  const pageAuthors = frontMatterPageAuthors
    .filter((author) => author.name !== undefined && author.name.length > 0)
    .map((author) => ({
      name: author.name!,
      url: author.url,
      title: author.title,
      email: author.email,
      permalink: _.kebabCase(author.key as string),
    }))
    .filter((pageAuthor) => pageAuthor.permalink.length > 0);

  const authors = pageAuthors.map((author) =>
    normalizeFrontMatterAuthor(authorsBaseRoutePath, author),
  );

  return _.uniqBy(authors, (author) => author.permalink);
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
  // TODO remove this and warn the user if we detect duplicates?
  Object.values(result).forEach((group) => {
    group.items = _.uniq(group.items);
  });

  return result;
}

// TODO is it useful?
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
