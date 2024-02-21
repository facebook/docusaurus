/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/LastUpdated';

function LastUpdatedAtDate({
  lastUpdatedAt,
  formattedLastUpdatedAt,
}: {
  lastUpdatedAt: number;
  formattedLastUpdatedAt: string;
}): JSX.Element {
  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <b>
            <time dateTime={new Date(lastUpdatedAt * 1000).toISOString()}>
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
}): JSX.Element {
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

export default function LastUpdated({
  lastUpdatedAt,
  lastUpdatedBy,
}: Props): JSX.Element {
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formatDate = (blogDate: string | number) =>
    dateTimeFormat.format(new Date(blogDate));

  const formattedLastUpdatedAt =
    lastUpdatedAt && formatDate(lastUpdatedAt * 1000);

  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.lastUpdatedAtBy"
        description="The sentence used to display when a page has been last updated, and by who"
        values={{
          atDate:
            lastUpdatedAt && formattedLastUpdatedAt ? (
              <LastUpdatedAtDate
                lastUpdatedAt={lastUpdatedAt}
                formattedLastUpdatedAt={formattedLastUpdatedAt}
              />
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
      {process.env.NODE_ENV === 'development' && (
        <div>
          {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
          <small> (Simulated during dev for better perf)</small>
        </div>
      )}
    </span>
  );
}
