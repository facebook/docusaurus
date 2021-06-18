/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import defaultTheme from 'prism-react-renderer/themes/palenight';
import type {PrismTheme} from 'prism-react-renderer';

const usePrismTheme = (): PrismTheme => {
  return defaultTheme;
};

export default usePrismTheme;
