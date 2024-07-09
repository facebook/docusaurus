/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {translate} from '@docusaurus/Translate';

export const translateAuthorsPageTitle = (): string =>
  translate({
    id: 'theme.authors.authorsPageTitle',
    message: 'Authors',
    description: 'The title of the author list page',
  });
