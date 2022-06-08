/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Created';

function CreatedAtDate({
  lastUpdatedAt,
  formattedLastUpdatedAt,
}: {
  lastUpdatedAt: number;
  formattedLastUpdatedAt: string;
}): JSX.Element {
  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page was created"
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

function CreatedByUser({lastUpdatedBy}: {lastUpdatedBy: string}): JSX.Element {
  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page was created"
      values={{
        user: <b>{lastUpdatedBy}</b>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

export default function Created({
  createdAt,
  formattedCreatedAt,
  createdBy,
}: Props): JSX.Element {
  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.lastUpdatedAtBy"
        description="The sentence used to display when a page was created, and by who"
        values={{
          atDate:
            createdAt && formattedCreatedAt ? (
              <CreatedAtDate
                lastUpdatedAt={createdAt}
                formattedLastUpdatedAt={formattedCreatedAt}
              />
            ) : (
              ''
            ),
          byUser: createdBy ? <CreatedByUser lastUpdatedBy={createdBy} /> : '',
        }}>
        {'Created{atDate}{byUser}'}
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
