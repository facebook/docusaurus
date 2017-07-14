/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* replaces translate tags with calls to translate function */

module.exports = function translatePlugin(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      JSXElement(path) {
        if (path.node.openingElement.name.name !== "translate") {
          return;
        }
        /* assume translate element only has one child which is the text */
        const text = path.node.children[0].value.trim().replace(/\s+/g, " ");
        let description = "no description given";
        const attributes = path.node.openingElement.attributes;
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].name.name === "desc") {
            description = attributes[i].value.value;
          }
        }
        /* use an expression container if inside a jsxelement */
        if (path.findParent(path => true).node.type === "JSXElement") {
          path.replaceWith(
            t.jSXExpressionContainer(
              t.callExpression(t.identifier("translate"), [
                t.stringLiteral(text + "|" + description)
              ])
            )
          );
        } else {
          path.replaceWith(
            t.callExpression(t.identifier("translate"), [
              t.stringLiteral(text + "|" + description)
            ])
          );
        }
      }
    }
  };
};
