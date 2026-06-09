/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';

type Props = {
  readonly createdAt?: number | null;
  readonly createdBy?: string | null;
};

function CreatedAtDate({createdAt}: {createdAt: number}): ReactNode {
  const atDate = new Date(createdAt);

  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formattedCreatedAt = dateTimeFormat.format(atDate);

  return (
    <Translate
      id="theme.created.atDate"
      description="The words used to describe on which date a page has been created"
      values={{
        date: (
          <b>
            <time dateTime={atDate.toISOString()}>{formattedCreatedAt}</time>
          </b>
        ),
      }}>
      {' on {date}'}
    </Translate>
  );
}

function CreatedByUser({createdBy}: {createdBy: string}): ReactNode {
  return (
    <Translate
      id="theme.created.byUser"
      description="The words used to describe by who the page has been created"
      values={{
        user: <b>{createdBy}</b>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

export default function Created({createdAt, createdBy}: Props): ReactNode {
  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.created.createdAtBy"
        description="The sentence used to display when a page has been created, and by who"
        values={{
          atDate: createdAt ? <CreatedAtDate createdAt={createdAt} /> : '',
          byUser: createdBy ? <CreatedByUser createdBy={createdBy} /> : '',
        }}>
        {'Created{atDate}{byUser}'}
      </Translate>
    </span>
  );
}
