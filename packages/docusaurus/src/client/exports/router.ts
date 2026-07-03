/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  useLocation,
  useNavigate,
  useNavigationType,
  Link,
  NavLink,
  BrowserRouter,
  HashRouter,
  unstable_HistoryRouter as HistoryRouter,
  StaticRouter,
} from 'react-router';
export {useHistory} from '../historyContext';
export {Redirect, matchPath} from './routerCompat';
