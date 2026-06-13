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
import type {Props} from '@theme/LastUpdated';

function LastUpdatedAtDate({
  lastUpdatedAt,
}: {
  lastUpdatedAt: number;
}): ReactNode {
  const atDate = new Date(lastUpdatedAt);

  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formattedLastUpdatedAt = dateTimeFormat.format(atDate);

  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <b>
            <time dateTime={atDate.toISOString()} itemProp="dateModified">
              {formattedLastUpdatedAt}
            </time>
          </b>
        ),
      }}>
      {' on {date}'}
    </Translate>
  );
}

function LastUpdatedByUser({
  lastUpdatedBy,
}: {
  lastUpdatedBy: string;
}): ReactNode {
  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page has been last updated"
      values={{
        user: <b>{lastUpdatedBy}</b>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

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
      id="theme.lastUpdated.createdAtDate"
      description="The words used to describe on which date a page has been created"
      values={{
        date: (
          <b>
            <time dateTime={atDate.toISOString()} itemProp="dateCreated">
              {formattedCreatedAt}
            </time>
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
      id="theme.lastUpdated.createdByUser"
      description="The words used to describe by who the page has been created"
      values={{
        user: <b>{createdBy}</b>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

function Created({createdAt, createdBy}: Props): ReactNode {
  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.createdAtBy"
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

function LastUpdatedMetadata({lastUpdatedAt, lastUpdatedBy}: Props): ReactNode {
  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.lastUpdatedAtBy"
        description="The sentence used to display when a page has been last updated, and by who"
        values={{
          atDate: lastUpdatedAt ? (
            <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} />
          ) : (
            ''
          ),
          byUser: lastUpdatedBy ? (
            <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} />
          ) : (
            ''
          ),
        }}>
        {'Last updated{atDate}{byUser}'}
      </Translate>
    </span>
  );
}

export default function LastUpdated({
  createdAt,
  createdBy,
  lastUpdatedAt,
  lastUpdatedBy,
}: Props): ReactNode {
  const canDisplayCreated = !!(createdAt || createdBy);
  const canDisplayLastUpdated = !!(lastUpdatedAt || lastUpdatedBy);

  return (
    <>
      {canDisplayCreated && (
        <Created createdAt={createdAt} createdBy={createdBy} />
      )}
      {canDisplayCreated && canDisplayLastUpdated && <br />}
      {canDisplayLastUpdated && (
        <LastUpdatedMetadata
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      )}
      {process.env.NODE_ENV === 'development' && (
        <div>
          {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
          <small> (Simulated during dev for better perf)</small>
        </div>
      )}
    </>
  );
}
