/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';
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
          <time
            dateTime={new Date(lastUpdatedAt * 1000).toISOString()}
            className={styles.lastUpdatedDate}>
            {formattedLastUpdatedAt}
          </time>
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
        user: <strong>{lastUpdatedBy}</strong>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

export default function LastUpdated({
  lastUpdatedAt,
  formattedLastUpdatedAt,
  lastUpdatedBy,
}: Props): JSX.Element {
  return (
    <div className="col text--right">
      <em>
        <small>
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
              <small> (Simulated during dev for better perf)</small>
            </div>
          )}
        </small>
      </em>
    </div>
  );
}
