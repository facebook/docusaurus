/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import {useActiveDocContext} from '@theme/hooks/useDocs';

function DocVersionCallout(props): JSX.Element {
  const {
    metadata: {version},
  } = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {latestAlternateDoc, latestAlternateVersion} = useActiveDocContext(); // TODO add instance path or id here!

  // If we are not on the latest version, we suggest user to use latest version
  // We link to the same doc in latest version if possible, or latest version home
  const latestAlternateDocOrVersion =
    latestAlternateDoc ?? latestAlternateVersion;

  if (!latestAlternateDocOrVersion) {
    return <></>;
  }

  return (
    <div className="alert alert--warning margin-bottom--md" role="alert">
      {version === 'next' ? (
        <div>
          This is unreleased documentation for {siteTitle}{' '}
          <strong>{version}</strong> version.
        </div>
      ) : (
        <div>
          This is archived documentation for {siteTitle}{' '}
          <strong>v{version}</strong>, which is no longer actively maintained.
        </div>
      )}
      <div className="margin-top--md">
        For up-to-date documentation, see the{' '}
        <strong>
          <Link to={latestAlternateDocOrVersion.path}>
            latest version ({latestAlternateDocOrVersion.version})
          </Link>
        </strong>
        .
      </div>
    </div>
  );
}

export default DocVersionCallout;
