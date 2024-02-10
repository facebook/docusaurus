/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

interface Props {
  readonly structuredData: object;
}

export default function StructuredData({structuredData}: Props): JSX.Element {
  return (
    <script
      type="application/ld+json"
      // We're using dangerouslySetInnerHTML because we want to avoid React
      // transforming quotes into &quot; which upsets parsers.
      // The entire contents is a stringified JSON object so it is safe
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
