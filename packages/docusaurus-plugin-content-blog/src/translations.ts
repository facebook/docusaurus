/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {BlogContent, PluginOptions, BlogPaginated} from './types';
import type {TranslationFileContent, TranslationFiles} from '@docusaurus/types';

function translateListPage(
  blogListPaginated: BlogPaginated[],
  translations: TranslationFileContent,
) {
  return blogListPaginated.map((page) => {
    const {items, metadata} = page;
    return {
      items,
      metadata: {
        ...metadata,
        blogTitle: translations.blogTitle.message,
        blogDescription: translations.blogDescription.message,
      },
    };
  });
}

export function getTranslationFiles(options: PluginOptions): TranslationFiles {
  return [
    {
      path: 'blog',
      content: {
        title: {
          message: options.blogTitle,
          description: 'The title for the blog used in SEO',
        },
        description: {
          message: options.blogDescription,
          description: 'The description for the blog used in SEO',
        },
        'sidebar.title': {
          message: options.blogSidebarTitle,
          description: 'The label for the left sidebar',
        },
      },
    },
  ];
}

export function translateLoadedContent(
  loadedContent: BlogContent,
  translationFiles: TranslationFiles,
): BlogContent {
  const {content: translations} = translationFiles[0];
  return {
    ...loadedContent,
    blogSidebarTitle: translations.blogSidebarTitle.message,
    blogListPaginated: translateListPage(
      loadedContent.blogListPaginated,
      translations,
    ),
  };
}
