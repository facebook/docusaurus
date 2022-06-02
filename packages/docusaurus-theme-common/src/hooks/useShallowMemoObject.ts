/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';

export default function useShallowMemoObject<O>(obj: O): O {
  return useMemo(
    () => obj,
    // Is this safe?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.keys(obj), ...Object.values(obj)],
  );
}
