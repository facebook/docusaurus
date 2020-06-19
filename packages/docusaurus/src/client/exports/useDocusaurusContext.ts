/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';
import context from './context';
import {DocusaurusContext} from '@docusaurus/types';

function useDocusaurusContext(): DocusaurusContext {
  return useContext(context);
}

export default useDocusaurusContext;
