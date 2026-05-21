/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ZeroWidthSpace = '\u200B';

function getMetadataSourceKey(source: string): string {
  return source.replaceAll(ZeroWidthSpace, '');
}

export function createMetadataSourceResolver({
  sources,
  createAmbiguousSourceError,
}: {
  sources: Iterable<string>;
  createAmbiguousSourceError?: (source: string) => Error;
}): (source: string) => string {
  const sourceKeyToSource = new Map<string, string>();
  const ambiguousSourceKeys = new Set<string>();

  for (const source of sources) {
    const sourceKey = getMetadataSourceKey(source);
    const existingSource = sourceKeyToSource.get(sourceKey);
    if (existingSource && existingSource !== source) {
      ambiguousSourceKeys.add(sourceKey);
      sourceKeyToSource.delete(sourceKey);
    } else if (!ambiguousSourceKeys.has(sourceKey)) {
      sourceKeyToSource.set(sourceKey, source);
    }
  }

  return (source) => {
    const sourceKey = getMetadataSourceKey(source);
    if (ambiguousSourceKeys.has(sourceKey)) {
      throw (
        createAmbiguousSourceError?.(source) ??
        new Error(
          `Docusaurus could not safely resolve the metadata path for "${source}" because multiple source paths only differ by U+200B ZERO WIDTH SPACE characters.`,
        )
      );
    }
    return sourceKeyToSource.get(sourceKey) ?? source;
  };
}
