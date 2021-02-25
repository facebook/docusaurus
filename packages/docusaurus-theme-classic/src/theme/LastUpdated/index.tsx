/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

function LastUpdatedAtDate({lastUpdatedAt}: {lastUpdatedAt: number}) {
  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        // TODO localize this date
        date: (
          <time
            dateTime={new Date(lastUpdatedAt * 1000).toISOString()}
            className={styles.lastUpdatedDate}>
            {new Date(lastUpdatedAt * 1000).toLocaleDateString()}
          </time>
        ),
      }}>
      {'on {{date}}'}
    </Translate>
  );
}

function LastUpdatedByUser({lastUpdatedBy}: {lastUpdatedBy: string}) {
  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page has been last updated"
      values={{
        user: <strong>{lastUpdatedBy}</strong>,
      }}>
      {'by {{user}}'}
    </Translate>
  );
}

export default function LastUpdated({
  lastUpdatedAt,
  lastUpdatedBy,
}: {
  lastUpdatedAt: number | undefined;
  lastUpdatedBy: string | undefined;
}) {
  return (
    <div className="col text--right">
      <em>
        <small>
          <Translate
            id="theme.common.lastUpdated.lastUpdatedAtBy"
            description="The sentence used to display when a page has been last updated, and by who"
            values={{
              on: lastUpdatedAt ? (
                <>
                  {' '}
                  <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} />
                </>
              ) : (
                ''
              ),
              by: lastUpdatedBy ? (
                <>
                  {' '}
                  <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} />
                </>
              ) : (
                ''
              ),
            }}>
            {'Last updated{{on}}{{by}}'}
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
