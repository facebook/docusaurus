/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {createContext, useMemo, type ReactNode} from 'react';
import type {
  ShowcaseItem,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';

// duplicated from theme classic showcase
type Props = {
  items: ShowcaseItem[];
  tags: TagsOption;
  screenshotApi: string;
  children: ReactNode;
};

export interface ShowcaseContextType {
  items: ShowcaseItem[];
  tags: TagsOption;
  screenshotApi: string;
}

const ShowcaseContext = createContext<ShowcaseContextType | undefined>(
  undefined,
);

// const useShowcaseContext = (): ShowcaseContextType => {
//   const context = useContext(ShowcaseContext);
//   if (!context) {
//     throw new Error(
//       'useShowcaseContext must be used within a ShowcaseProvider',
//     );
//   }
//   return context;
// };

export function ShowcaseProvider({
  items,
  tags,
  screenshotApi,
  children,
}: Props): JSX.Element {
  const contextValue = useMemo(
    () => ({items, tags, screenshotApi}),
    [items, tags, screenshotApi],
  );

  return (
    <ShowcaseContext.Provider value={contextValue}>
      {children}
    </ShowcaseContext.Provider>
  );
}
