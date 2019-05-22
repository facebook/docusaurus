/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {DocusaurusConfig} from '../../server/config';

export interface DocusaurusContext {
  siteConfig?: DocusaurusConfig;
}

export default React.createContext<DocusaurusContext>({});
