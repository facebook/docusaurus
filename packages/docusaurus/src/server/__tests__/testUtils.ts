/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadSite, type LoadContextParams} from '../site';
import type {Site} from '@docusaurus/types';

// Helper methods to setup dummy/fake projects.
export async function loadSetup(
  name: string,
  options?: Partial<LoadContextParams>,
): Promise<Site> {
  const fixtures = path.join(__dirname, '__fixtures__');
  return loadSite({siteDir: path.join(fixtures, name), ...options});
}
