/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {describe, expect, it, vi} from 'vitest';
import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LastUpdated from '../index';

vi.mock('@docusaurus/useDocusaurusContext', () => ({
  default: () => ({
    i18n: {
      currentLocale: 'en',
      localeConfigs: {
        en: {calendar: 'gregory'},
      },
    },
  }),
}));

describe('LastUpdated', () => {
  it('renders created and last updated metadata', () => {
    const createdAt = Date.UTC(2020, 0, 2);
    const lastUpdatedAt = Date.UTC(2021, 1, 3);

    const {container} = render(
      <LastUpdated
        createdAt={createdAt}
        createdBy="Creator"
        lastUpdatedAt={lastUpdatedAt}
        lastUpdatedBy="Updater"
      />,
    );

    expect(screen.getByText(/Created/)).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    expect(screen.getByText('Updater')).toBeInTheDocument();

    expect(
      container.querySelector('time[itemprop="dateCreated"]'),
    ).toHaveAttribute('datetime', new Date(createdAt).toISOString());
    expect(
      container.querySelector('time[itemprop="dateModified"]'),
    ).toHaveAttribute('datetime', new Date(lastUpdatedAt).toISOString());
  });
});
