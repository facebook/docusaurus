/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function SocialCardServiceTests(): JSX.Element {
  const {
    siteConfig: {
      socialCardService: {options},
    },
  } = useDocusaurusContext();
  const socialCardUrl = `${options?.baseUrl}${encodeURIComponent(
    'a custom URL',
  )}`;
  return (
    <Layout socialCardUrl={socialCardUrl}>
      <img
        src={socialCardUrl}
        width="auto"
        height="100%"
        alt="Social Card Url"
      />
    </Layout>
  );
}
