/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocCategoryGeneratedIndexPage';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import Seo from '@theme/Seo';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

export default function DocCategoryGeneratedIndexPage({
  categoryGeneratedIndex,
}: Props): JSX.Element {
  const category = useCurrentSidebarCategory();
  return (
    <>
      <Seo
        title={categoryGeneratedIndex.title}
        description={categoryGeneratedIndex.description}
        keywords={categoryGeneratedIndex.keywords}
        // TODO `require` this?
        image={useBaseUrl(categoryGeneratedIndex.image)}
      />
      <div className={styles.generatedIndexPage}>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <header>
          <Heading as="h1" className={styles.title}>
            {categoryGeneratedIndex.title}
          </Heading>
          {categoryGeneratedIndex.description && (
            <p>{categoryGeneratedIndex.description}</p>
          )}
        </header>
        <main className="margin-top--lg">
          <DocCardList items={category.items} />
        </main>
        <footer className="margin-top--lg">
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </>
  );
}
