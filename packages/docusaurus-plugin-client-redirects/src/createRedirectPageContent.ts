/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import * as eta from 'eta';
import redirectPageTemplate from './templates/redirectPage.template.html';

const getCompiledRedirectPageTemplate = _.memoize(() =>
  eta.compile(redirectPageTemplate.trim()),
);

function renderRedirectPageTemplate(data: {
  toUrl: string;
  searchAnchorForwarding: boolean;
}) {
  const compiled = getCompiledRedirectPageTemplate();
  return compiled(data, eta.defaultConfig);
}

// if the target url does not include ?search#anchor,
// we forward search/anchor that the redirect page receives
function searchAnchorForwarding(toUrl: string): boolean {
  try {
    const url = new URL(toUrl, 'https://example.com');
    const containsSearchOrAnchor = url.search || url.hash;
    return !containsSearchOrAnchor;
  } catch (e) {
    return false;
  }
}

export default function createRedirectPageContent({
  toUrl,
}: {
  toUrl: string;
}): string {
  return renderRedirectPageTemplate({
    toUrl: encodeURI(toUrl),
    searchAnchorForwarding: searchAnchorForwarding(toUrl),
  });
}
