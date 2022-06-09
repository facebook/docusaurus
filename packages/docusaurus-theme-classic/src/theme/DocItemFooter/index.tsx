/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import LastUpdated from '@theme/LastUpdated';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline, {
  type Props as TagsListInlineProps,
} from '@theme/TagsListInline';
import type {Props} from '@theme/DocItem';

import styles from './styles.module.css';
import Created from '../Created';

function TagsRow(props: TagsListInlineProps) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        'row margin-bottom--sm',
      )}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}

type EditMetaRowProps = Pick<
  Props['content']['metadata'],
  | 'editUrl'
  | 'lastUpdatedAt'
  | 'lastUpdatedBy'
  | 'formattedLastUpdatedAt'
  | 'createdAt'
  | 'createdBy'
  | 'formattedCreatedAt'
>;
function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
  createdAt,
  createdBy,
  formattedCreatedAt,
}: EditMetaRowProps) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, 'row')}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx('col', styles.lastUpdated)}>
        <div>
          {(lastUpdatedAt || lastUpdatedBy) && (
            <LastUpdated
              lastUpdatedAt={lastUpdatedAt}
              formattedLastUpdatedAt={formattedLastUpdatedAt}
              lastUpdatedBy={lastUpdatedBy}
            />
          )}
        </div>
        <div>
          {(createdAt || createdBy) && (
            <Created
              createdAt={createdAt}
              formattedCreatedAt={formattedCreatedAt}
              createdBy={createdBy}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocItemFooter(props: Props): JSX.Element | null {
  const {content: DocContent} = props;
  const {metadata} = DocContent;
  const {
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    tags,
    createdAt,
    formattedCreatedAt,
    createdBy,
  } = metadata;

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(
    editUrl ||
    lastUpdatedAt ||
    lastUpdatedBy ||
    createdAt ||
    createdBy
  );

  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  if (!canDisplayFooter) {
    return null;
  }

  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
          createdAt={createdAt}
          createdBy={createdBy}
          formattedCreatedAt={formattedCreatedAt}
        />
      )}
    </footer>
  );
}
