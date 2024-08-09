/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {useDocsVersion, DocsVersionProvider} from '../docsVersion';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';

function testVersion(data?: Partial<PropVersionMetadata>): PropVersionMetadata {
  return {
    version: 'versionName',
    label: 'Version Label',
    className: 'version className',
    badge: true,
    banner: 'unreleased',
    docs: {},
    docsSidebars: {},
    isLast: false,
    pluginId: 'default',
    ...data,
  };
}

describe('useDocsVersion', () => {
  it('throws if context provider is missing', () => {
    expect(
      () => renderHook(() => useDocsVersion()).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Hook useDocsVersion is called outside the <DocsVersionProvider>. "`,
    );
  });

  it('reads value from context provider', () => {
    const version = testVersion();
    const {result} = renderHook(() => useDocsVersion(), {
      wrapper: ({children}) => (
        <DocsVersionProvider version={version}>{children}</DocsVersionProvider>
      ),
    });
    expect(result.current).toBe(version);
  });
});
