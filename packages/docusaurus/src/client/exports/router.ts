/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import siteConfig from '@generated/docusaurus.config';
import {HashRouter, BrowserRouter} from 'react-router-dom';

export {useHistory, useLocation, Redirect, matchPath} from 'react-router-dom';

export const Router = siteConfig.router === 'hash' ? HashRouter : BrowserRouter;
