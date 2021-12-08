/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {ThemeClassNames, usePluralForm} from '@docusaurus/theme-common';
import type {PropTagDocListDoc} from '@docusaurus/plugin-content-docs';
import Translate, {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/DocTagDocListPage';

// Very simple pluralization: probably good enough for now
function useNDocsTaggedPlural() {
  const {selectMessage} = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.docs.tagDocListPageTitle.nDocsTagged',
          description:
            'Pluralized label for "{count} docs tagged". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One doc tagged|{count} docs tagged',
        },
        {count},
      ),
    );
}

function DocItem({doc}: {doc: PropTagDocListDoc}): JSX.Element {
  return (
    <article className="margin-vert--lg">
      <Link to={doc.permalink}>
        <h2>{doc.title}</h2>
      </Link>
      {doc.description && <p>{doc.description}</p>}
    </article>
  );
}

export default function DocTagDocListPage({tag}: Props): JSX.Element {
  const nDocsTaggedPlural = useNDocsTaggedPlural();
  const title = translate(
    {
      id: 'theme.docs.tagDocListPageTitle',
      description: 'The title of the page for a docs tag',
      message: '{nDocsTagged} with "{tagName}"',
    },
    {nDocsTagged: nDocsTaggedPlural(tag.docs.length), tagName: tag.name},
  );

  return (
    <Layout
      title={title}
      wrapperClassName={ThemeClassNames.wrapper.docsPages}
      pageClassName={ThemeClassNames.page.docsTagDocListPage}
      searchMetadata={{
        // assign unique search tag to exclude this page from search results!
        tag: 'doc_tag_doc_list',
      }}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <header className="margin-bottom--xl">
              <h1>{title}</h1>
              <Link href={tag.allTagsPath}>
                <Translate
                  id="theme.tags.tagsPageLink"
                  description="The label of the link targeting the tag list page">
                  View All Tags
                </Translate>
              </Link>
            </header>
            <section className="margin-vert--lg">
              {tag.docs.map((doc) => (
                <DocItem key={doc.id} doc={doc} />
              ))}
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
}
