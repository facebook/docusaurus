/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, useContext} from 'react';

const DocContext = React.createContext(null);

export const DocContextProvider = ({
  docsMetadata,
  currentDocRoute,
  children,
}) => {
  const value = useMemo(() => ({docsMetadata, currentDocRoute}), [
    docsMetadata,
    currentDocRoute,
  ]);
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
};

export const useDocContext = () => {
  const value = useContext(DocContext);
  if (!value) {
    throw new Error(
      `Doc context is not provided. Note: it is only possible to read the doc context in document-related components. It is not possible to read the doc context in the global layout because this layout is global and not necessarily related to docs.`,
    );
  }
  return value;
};
