/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer} from 'unified';
import type {FootnoteReference, FootnoteDefinition} from 'mdast';

declare global {
  /* eslint-disable vars-on-top, no-var */
  var fixerUsedUniqueStrings: string[];
}

interface IFootnoteIDMap {
  originalID: string;
  fixedID: string;
}

global.fixerUsedUniqueStrings = global.fixerUsedUniqueStrings ?? [];

export default function plugin(): Transformer {
  const idMaps: IFootnoteIDMap[] = [];
  return (root) => {
    visit(root, 'footnoteReference', (node: FootnoteReference) => {
      const map: IFootnoteIDMap = {
        originalID: node.identifier.concat(''),
        fixedID: '',
      };
      const existingIDMap = idMaps.findIndex(
        (idMap) => idMap.originalID === map.originalID,
      );
      if (existingIDMap > -1) {
        idMaps.splice(existingIDMap, 1);
      }
      let randomString = '';
      /* eslint-disable no-loop-func */
      do {
        randomString = Math.random().toString(36).substring(2, 8);
      } while (
        global.fixerUsedUniqueStrings.find((str) => str === randomString) !==
        undefined
      );
      node.identifier = `${node.identifier}-${randomString}`;
      map.fixedID = node.identifier;
      idMaps.push(map);
    });
    visit(root, 'footnoteDefinition', (node: FootnoteDefinition) => {
      const idMap = idMaps.find((map) => map.originalID === node.identifier);
      if (idMap) {
        node.identifier = idMap.fixedID;
      }
    });
  };
}
