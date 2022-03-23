/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {useDocsSidebar, DocsSidebarProvider} from '../docsSidebar';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';

describe('useDocsSidebar', () => {
  it('throws if context provider is missing', () => {
    expect(
      () => renderHook(() => useDocsSidebar()).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Hook useDocsSidebar is called outside the <DocsSidebarProvider>. "`,
    );
  });

  it('reads value from context provider', () => {
    const sidebar: PropSidebar = [];
    const {result} = renderHook(() => useDocsSidebar(), {
      wrapper: ({children}) => (
        <DocsSidebarProvider sidebar={sidebar}>{children}</DocsSidebarProvider>
      ),
    });
    expect(result.current).toBe(sidebar);
  });
});
