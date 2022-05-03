/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {TranslationFileContent, TranslationFile} from '@docusaurus/types';
import type {
  PluginOptions,
  BlogContent,
  BlogPaginated,
} from '@docusaurus/plugin-content-blog';

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
        blogTitle: translations.title?.message ?? page.metadata.blogTitle,
        blogDescription:
          translations.description?.message ?? page.metadata.blogDescription,
      },
    };
  });
}

export function getTranslationFiles(options: PluginOptions): TranslationFile[] {
  return [
    {
      path: 'options',
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

export function translateContent(
  content: BlogContent,
  translationFiles: TranslationFile[],
): BlogContent {
  const {content: optionsTranslations} = translationFiles[0]!;
  return {
    ...content,
    blogSidebarTitle:
      optionsTranslations['sidebar.title']?.message ?? content.blogSidebarTitle,
    blogListPaginated: translateListPage(
      content.blogListPaginated,
      optionsTranslations,
    ),
  };
}
