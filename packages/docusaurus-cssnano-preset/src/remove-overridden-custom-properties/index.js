/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const postcss = require('postcss');

/*
This PostCSS plugin will remove duplicate/same custom properties (which are actually overridden ones) **only** from `:root` selector.

Depending on the presence of an `!important` rule in value of custom property, the following actions will happens:

- If the same custom properties do **not** have an `!important` rule, then all of them will be removed except for the last one (which will actually be applied).
- If the same custom properties have at least one `!important` rule, then only those properties that do not have this rule will be removed.
*/

module.exports = postcss.plugin(
  'postcss-remove-overridden-custom-properties',
  () => {
    return (root) => {
      root.walkDecls((decl) => {
        if (decl.parent.selector !== ':root') {
          return;
        }

        const sameProperties =
          decl.parent.nodes.filter((n) => n.prop === decl.prop) || [];
        const hasImportantProperties = sameProperties.some((p) =>
          Object.prototype.hasOwnProperty.call(p, 'important'),
        );

        const overriddenProperties = hasImportantProperties
          ? sameProperties.filter(
              (p) => !Object.prototype.hasOwnProperty.call(p, 'important'),
            )
          : sameProperties.slice(0, -1);

        overriddenProperties.map((p) => p.remove());
      });
    };
  },
);
