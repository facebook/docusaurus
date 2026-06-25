/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames, HtmlClassNameProvider} from '@docusaurus/theme-common';
import {Outlet} from 'react-router';
import Layout from '@theme/Layout';

import type {Props} from '@theme/DocVersionRoot';

export default function DocsRoot(_props: Props): ReactNode {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages)}>
      <Layout>
        <Outlet />
      </Layout>
    </HtmlClassNameProvider>
  );
}
