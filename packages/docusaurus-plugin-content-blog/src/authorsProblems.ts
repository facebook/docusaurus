/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import type {Author, PluginOptions} from '@docusaurus/plugin-content-blog';

export function reportAuthorsProblems({
  authors,
  blogSourceRelative,
  options: {onInlineAuthors, authorsMapPath},
}: {
  authors: Author[];
  blogSourceRelative: string;
  options: Pick<PluginOptions, 'onInlineAuthors' | 'authorsMapPath'>;
}): void {
  reportInlineAuthors();
  reportDuplicateAuthors();

  function reportInlineAuthors(): void {
    if (onInlineAuthors === 'ignore') {
      return;
    }
    const inlineAuthors = authors.filter((author) => !author.key);
    if (inlineAuthors.length > 0) {
      logger.report(onInlineAuthors)(
        `Some blog authors used in ${blogSourceRelative} are not defined in ${authorsMapPath}:
- ${inlineAuthors.map(authorToString).join('\n- ')}

Note: if you want to allow inline blog authors, ignore this warning by setting onInlineAuthors: 'ignore' in your blog plugin options.
`,
      );
    }
  }

  function reportDuplicateAuthors(): void {
    const duplicateAuthors = _(authors)
      // for now we only check for predefined authors duplicates
      .filter((author) => !!author.key)
      .groupBy((author) => author.key)
      .pickBy((authorsByKey) => authorsByKey.length > 1)
      // We only keep the "test" of all the duplicate groups
      // The first author of a group is not really a duplicate...
      .flatMap(([, ...rest]) => rest)
      .value();

    if (duplicateAuthors.length > 0) {
      throw new Error(`Duplicate blog authors found in blog post ${blogSourceRelative} front matter:
- ${duplicateAuthors.map(authorToString).join('\n- ')}`);
    }
  }
}

function authorToString(author: Author) {
  return JSON.stringify(author);
}
