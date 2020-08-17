/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DebugMetadata() {
  const {siteMetadata} = useDocusaurusContext();
  return (
    <DebugLayout>
      <h2>Site Metadata</h2>
      <div>Docusaurus Version: {siteMetadata.docusaurusVersion}</div>
      <div>
        Site Version: {siteMetadata.siteVersion || 'No version specified'}
      </div>
      <h3>Plugins and themes:</h3>
      <ul>
        {Object.entries(siteMetadata.pluginVersions).map(
          ([name, versionInformation]) => (
            <li key={name}>
              <div>Name: {name}</div>
              <div>Type: {versionInformation.type}</div>
              {versionInformation.version && (
                <div>Version: {versionInformation.version}</div>
              )}
            </li>
          ),
        )}
      </ul>
    </DebugLayout>
  );
}

export default DebugMetadata;
