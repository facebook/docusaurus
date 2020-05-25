/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const eta = require('eta');
const redirectPageTemplate = require('./template/redirectPage.html.template');

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
