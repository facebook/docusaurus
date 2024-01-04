/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {inject} from '@vercel/analytics';

/* eslint-disable prefer-destructuring */
const VERCEL_ANALYTICS_DEBUG = process.env.VERCEL_ANALYTICS_DEBUG;
const VERCEL_ANALYTICS_MODE = process.env.VERCEL_ANALYTICS_MODE;

// todo fix type error
inject({
  mode: VERCEL_ANALYTICS_MODE ?? 'production',
  debug: VERCEL_ANALYTICS_DEBUG ?? false,
});
