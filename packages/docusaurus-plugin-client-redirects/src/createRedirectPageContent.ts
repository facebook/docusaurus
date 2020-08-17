/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import redirectPageTemplate from './templates/redirectPage.template.html';
import {memoize} from 'lodash';

type CreateRedirectPageOptions = {
  toUrl: string;
};

const getCompiledRedirectPageTemplate = memoize(() => {
  return eta.compile(redirectPageTemplate.trim());
});

function renderRedirectPageTemplate(data: object) {
  const compiled = getCompiledRedirectPageTemplate();
  return compiled(data, eta.defaultConfig);
}

export default function createRedirectPageContent({
  toUrl,
}: CreateRedirectPageOptions) {
  return renderRedirectPageTemplate({
    toUrl: encodeURI(toUrl),
  });
}
