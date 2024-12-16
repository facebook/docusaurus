/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useContext} from 'react';
import {ReactContextError} from '@docusaurus/theme-common/internal';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';

const Context = React.createContext<PropVersionMetadata | null>(null);

/**
 * Provide the current version's metadata to your children.
 */
export function DocsVersionProvider({
  children,
  version,
}: {
  children: ReactNode;
  version: PropVersionMetadata | null;
}): ReactNode {
  return <Context.Provider value={version}>{children}</Context.Provider>;
}

/**
 * Gets the version metadata of the current doc page.
 */
export function useDocsVersion(): PropVersionMetadata {
  const version = useContext(Context);
  if (version === null) {
    throw new ReactContextError('DocsVersionProvider');
  }
  return version;
}
