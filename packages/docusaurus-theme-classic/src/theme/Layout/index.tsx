/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import LayoutHead from '@theme/LayoutHead';
import type {Props} from '@theme/Layout';
import Head from '@docusaurus/Head';
import useKeyboardNavigation from '@theme/hooks/useKeyboardNavigation';
import {useThemeConfig, ThemeClassNames} from '@docusaurus/theme-common';
import './styles.css';

function Layout(props: Props): JSX.Element {
  const {children, noFooter, wrapperClassName, pageClassName} = props;
  const {metadatas} = useThemeConfig();

  useKeyboardNavigation();

  return (
    <LayoutProviders>
      <LayoutHead {...props} />

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div
        className={clsx(
          ThemeClassNames.wrapper.main,
          wrapperClassName,
          pageClassName,
        )}>
        {children}
      </div>

      {!noFooter && <Footer />}

      <Head
      // It's important to put an additional <Head> element after other React components,
      // as it allows react-helmet to override values set in previous <Head>
      // ie we can override default metadatas such as "twitter:card"
      // In same Head, the same meta would appear twice instead of overriding
      // See react-helmet doc
      >
        {metadatas.map((metadata, i) => (
          <meta key={`metadata_${i}`} {...metadata} />
        ))}
      </Head>
    </LayoutProviders>
  );
}

export default Layout;
