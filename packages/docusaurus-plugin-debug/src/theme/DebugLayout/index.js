/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
// import styles from './styles.module.css';

const DebugNavLink = ({to, children}) => (
  <Link
    style={{margin: 10}}
    className="button button--primary"
    isNavLink
    activeClassName="button--active"
    to={to}
    exact>
    {children}
  </Link>
);

function DebugLayout({children}) {
  return (
    <div>
      <nav style={{width: '100%', padding: 10, border: 'solid'}}>
        <DebugNavLink to="/__docusaurus/debug">Config</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/metadata">Metadata</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/registry">Registry</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/routes">Routes</DebugNavLink>
        <DebugNavLink to="/__docusaurus/debug/content">Content</DebugNavLink>
      </nav>
      <main style={{padding: 20}}>{children}</main>
    </div>
  );
}

export default DebugLayout;
