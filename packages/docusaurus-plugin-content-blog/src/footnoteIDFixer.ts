/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type unified from 'unified';
import type {Data, Node, Position} from 'unist';
import {visit} from 'unist-util-visit';

declare global {
  /* eslint-disable vars-on-top, no-var */
  var fixerUsedUniqueStrings: string[];
}

interface IFootnoteReferenceNode extends Node<Data> {
  type: 'footnoteReference';
  identifier: string;
  label: string;
  position: Position;
}

interface IFootnoteDefinitionNode extends Node<Data> {
  type: 'footnoteDefinition';
  identifier: string;
  label: string;
  position: Position;
  children: Node<Data>[];
}

interface IFootnoteIDMap {
  originalID: string;
  fixedID: string;
}

global.fixerUsedUniqueStrings = global.fixerUsedUniqueStrings ?? [];

const footnoteIDFixer: unified.Plugin = () => {
  const idMaps: IFootnoteIDMap[] = [];
  const transformer: unified.Transformer = async (ast) => {
    visit(ast, 'footnoteReference', (node: IFootnoteReferenceNode) => {
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
    visit(ast, 'footnoteDefinition', (node: IFootnoteDefinitionNode) => {
      const idMap = idMaps.find((map) => map.originalID === node.identifier);
      if (idMap) {
        node.identifier = idMap.fixedID;
      }
    });
  };
  return transformer;
};

export default footnoteIDFixer;
