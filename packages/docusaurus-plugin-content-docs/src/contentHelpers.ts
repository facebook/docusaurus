/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createMetadataSourceResolver} from '@docusaurus/utils';
import type {DocMetadata, LoadedContent} from '@docusaurus/plugin-content-docs';

function indexDocsBySource(content: LoadedContent): Map<string, DocMetadata> {
  const allDocs = content.loadedVersions.flatMap((v) => v.docs);
  return new Map(allDocs.map((doc) => [doc.source, doc]));
}

type ContentHelpers = {
  updateContent: (content: LoadedContent) => void;
  sourceToDoc: Map<string, DocMetadata>;
  sourceToPermalink: Map<string, string>;
  getMetadataSource: (source: string) => string;
};

// TODO this is bad, we should have a better way to do this (new lifecycle?)
//  The source to doc/permalink is a mutable map passed to the mdx loader
//  See https://github.com/facebook/docusaurus/pull/10457
//  See https://github.com/facebook/docusaurus/pull/10185
export function createContentHelpers(): ContentHelpers {
  const sourceToDoc = new Map<string, DocMetadata>();
  const sourceToPermalink = new Map<string, string>();
  let metadataSourceResolver = createMetadataSourceResolver({
    sources: sourceToDoc.keys(),
    createAmbiguousSourceError: createAmbiguousMetadataSourceError,
  });

  // Mutable map update :/
  function updateContent(content: LoadedContent): void {
    sourceToDoc.clear();
    sourceToPermalink.clear();
    const docsBySource = indexDocsBySource(content);
    docsBySource.forEach((value, key) => {
      sourceToDoc.set(key, value);
      sourceToPermalink.set(key, value.permalink);
    });
    metadataSourceResolver = createMetadataSourceResolver({
      sources: docsBySource.keys(),
      createAmbiguousSourceError: createAmbiguousMetadataSourceError,
    });
  }

  function createAmbiguousMetadataSourceError(source: string): Error {
    return new Error(`Docusaurus could not safely resolve the docs metadata path for "${source}" because multiple docs paths only differ by U+200B ZERO WIDTH SPACE characters.
Please rename the affected docs files or folders to remove the invisible zero-width spaces.`);
  }

  function getMetadataSource(source: string): string {
    return metadataSourceResolver(source);
  }

  return {updateContent, sourceToDoc, sourceToPermalink, getMetadataSource};
}
