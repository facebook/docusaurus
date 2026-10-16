/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useContext} from 'react';
import useRouteContext from '@docusaurus/useRouteContext';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';

const Context = React.createContext<PropVersionMetadata | null>(null);

/**
 * Provide a version's metadata to your children, taking precedence over the
 * route context.
 *
 * Docs routes don't need it: `useDocsVersion()` reads the current version's
 * metadata from the route context.
 */
export function DocsVersionProvider({
  children,
  version,
}: {
  children: ReactNode;
  version: PropVersionMetadata | null;
}): ReactNode {
  return <Context value={version}>{children}</Context>;
}

function useRouteContextDocsVersion(): PropVersionMetadata | undefined {
  const routeContext = useRouteContext();
  return routeContext.data?.docsVersion as PropVersionMetadata | undefined;
}

/**
 * Gets the version metadata of the current doc page.
 */
export function useDocsVersion(): PropVersionMetadata {
  const providedVersion = useContext(Context);
  const routeContextVersion = useRouteContextDocsVersion();
  const version = providedVersion ?? routeContextVersion;
  if (!version) {
    throw new Error(
      "useDocsVersion() can't be called on the current route because the docs version metadata could not be found in route context",
    );
  }
  return version;
}
