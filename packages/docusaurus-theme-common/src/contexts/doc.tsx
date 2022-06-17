/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, type ReactNode, useContext} from 'react';
import {ReactContextError} from '../utils/reactUtils';
import type {PropDocContent} from '@docusaurus/plugin-content-docs';

export type DocContextValue = {MDXComponent: () => JSX.Element} & Pick<
  PropDocContent,
  'metadata' | 'frontMatter' | 'toc' | 'assets' | 'contentTitle'
>;

const Context = React.createContext<DocContextValue | null>(null);

/**
 * Note: we don't use PropDoc as context value on purpose
 * Metadata is currently stored inside the MDX component,
 * but we may want to change that in the future.
 * This layer is a good opportunity to decouple storage from consuming API.
 */
function useContextValue(content: PropDocContent): DocContextValue {
  return useMemo(
    () => ({
      MDXComponent: content,
      metadata: content.metadata,
      frontMatter: content.frontMatter,
      assets: content.assets,
      contentTitle: content.contentTitle,
      toc: content.toc,
    }),
    [content],
  );
}

/**
 * Provide the current doc content to children.
 */
export function DocProvider({
  children,
  content,
}: {
  children: ReactNode;
  content: PropDocContent;
}): JSX.Element {
  const contextValue = useContextValue(content);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

/**
 * Gets the current doc content (MDX component).
 * Note: this is also how you access
 */
export function useDoc(): DocContextValue {
  const doc = useContext(Context);
  if (doc === null) {
    throw new ReactContextError('DocProvider');
  }
  return doc;
}
