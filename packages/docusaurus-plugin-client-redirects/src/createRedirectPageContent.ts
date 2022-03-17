/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import redirectPageTemplate from './templates/redirectPage.template.html';
import _ from 'lodash';

const getCompiledRedirectPageTemplate = _.memoize(() =>
  eta.compile(redirectPageTemplate.trim()),
);

function renderRedirectPageTemplate(data: Record<string, unknown>) {
  const compiled = getCompiledRedirectPageTemplate();
  return compiled(data, eta.defaultConfig);
}

export default function createRedirectPageContent({
  toUrl,
}: {
  toUrl: string;
}): string {
  return renderRedirectPageTemplate({
    toUrl: encodeURI(toUrl),
  });
}
