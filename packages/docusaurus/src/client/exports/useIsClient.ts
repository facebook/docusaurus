/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';
import {Context} from './clientContext';

export default function useIsClient(): boolean {
  return useContext(Context);
}
