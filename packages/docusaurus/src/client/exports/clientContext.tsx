/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode, useEffect, useState} from 'react';

// Encapsulate the logic to avoid React hydration problems
// See https://www.joshwcomeau.com/react/the-perils-of-rehydration/
// On first client-side render, we need to render exactly as the server rendered
// isClient is set to true only after a successful hydration

// Note, isClient is not part of useDocusaurusContext() for perf reasons
// Using useDocusaurusContext() (much more common need) should not trigger re-rendering after a successful hydration

export const Context = React.createContext<boolean>(false);

export function ClientContextProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <Context.Provider value={isClient}>{children}</Context.Provider>;
}
