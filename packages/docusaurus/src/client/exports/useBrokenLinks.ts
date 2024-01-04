/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useBrokenLinksContext} from '../BrokenLinksContext';
import type {BrokenLinks} from '@docusaurus/useBrokenLinks';

export default function useBrokenLinks(): BrokenLinks {
  return useBrokenLinksContext();
}
