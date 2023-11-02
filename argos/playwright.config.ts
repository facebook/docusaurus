/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {devices} from '@playwright/test';
import type {PlaywrightTestConfig} from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',

  timeout: 60000,

  reporter: [['list'], ['@argos-ci/playwright/reporter']],

  // Run website production built
  // Need to run "yarn website:build:fast" before
  webServer: {
    cwd: '..',
    port: 3000,
    command: 'yarn serve:website',
  },

  // Browsers: only Chrome for now
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
};

export default config;
