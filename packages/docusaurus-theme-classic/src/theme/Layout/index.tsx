/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import type {Props} from '@theme/Layout';
import {ThemeClassNames, useKeyboardNavigation} from '@docusaurus/theme-common';
import ErrorPageContent from '@theme/ErrorPageContent';
import './styles.css';

export default function Layout(props: Props): JSX.Element {
  const {children, noFooter} = props;

  useKeyboardNavigation();

  return (
    <LayoutProviders>
      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div className={clsx(ThemeClassNames.wrapper.main)}>
        <ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  );
}
