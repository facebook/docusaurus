/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import toSlug from './toSlug';

export default function anchors(md) {
  const originalRender = md.renderer.rules.heading_close;

  // eslint-disable-next-line
  md.renderer.rules.heading_close = function(tokens, idx, options, env) {
    const textToken = tokens[idx - 1];

    if (textToken.content) {
      const anchor = toSlug(textToken.content, env);

      return ` <a aria-hidden="true" id="${anchor}"></a><a aria-hidden="true" class="hash-link" href="#${anchor}">#</a></h${
        tokens[idx].hLevel
      }>
`;
    }

    return originalRender(tokens, idx, options, env);
  };
}
