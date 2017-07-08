/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* find all strings with their descriptions that need to be translated and write
   to i18n/en.json file */

const fs = require("fs");

module.exports = function findStringsPlugin(babel) {
  const { types: t } = babel;

  const translationsFile = process.cwd() + "/i18n/en.json";
  let currentTranslations = JSON.parse(
    fs.readFileSync(translationsFile, "utf8")
  );

  return {
    visitor: {
      JSXElement(path) {
        if (path.node.openingElement.name.name !== "Translate") {
          return;
        }
        const text = path.node.children[0].value.trim();
        let description;
        const attributes = path.node.openingElement.attributes;
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].name.name === "desc") {
            description = attributes[i].value.value;
          }
        }
        if (!currentTranslations["pages-strings"]) {
          currentTranslations["pages-strings"] = {};
        }
        currentTranslations["pages-strings"][text + "|" + description] = text;
        fs.writeFileSync(translationsFile, JSON.stringify(currentTranslations));
      }
    }
  };
};
