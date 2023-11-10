/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useAnchorsCollector,
  createStatefulAnchorsCollector,
} from '../AnchorsCollector';
import type {AnchorsCollector} from '@docusaurus/useAnchor';

export default function useAnchor(): [
  AnchorsCollector,
  () => AnchorsCollector,
] {
  return [useAnchorsCollector(), createStatefulAnchorsCollector];
}
