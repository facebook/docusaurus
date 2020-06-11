/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import redirectPageTemplate from './templates/redirectPage.template.html';

type CreateRedirectPageOptions = {
  toUrl: string;
};

export default function createRedirectPageContent({
  toUrl,
}: CreateRedirectPageOptions) {
  return eta.render(redirectPageTemplate.trim(), {
    toUrl: encodeURI(toUrl),
  });
}
