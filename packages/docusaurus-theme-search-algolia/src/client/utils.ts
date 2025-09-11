/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {FacetFilters} from 'algoliasearch/lite';

export function mergeFacetFilters(
  f1: FacetFilters,
  f2: FacetFilters,
): FacetFilters {
  const normalize = (f: FacetFilters): FacetFilters =>
    typeof f === 'string' ? [f] : f;
  return [...normalize(f1), ...normalize(f2)];
}
