/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const DebugNavLink = ({to, children}) => (
  <Link
    className={styles.navlink}
    isNavLink
    to={to}
    exact
    activeStyle={{
      backgroundColor: '#363739',
    }}>
    {children}
  </Link>
);

function DebugLayout({children}) {
  return (
    <div>
      <nav className={styles.nav}>
        <DebugNavLink to="/__docusaurus/debug">Config</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/metadata">Metadata</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/registry">Registry</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/routes">Routes</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/content">Content</DebugNavLink>
      </nav>
      <main className={styles.container}>{children}</main>
    </div>
  );
}

export default DebugLayout;
