/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/theme-common/internal';

export default function DocItemMetadata(): JSX.Element {
  const {metadata, frontMatter, assets} = useDoc();
  return (
    <PageMetadata
      title={metadata.title}
      description={metadata.description}
      keywords={frontMatter.keywords}
      image={assets.image ?? frontMatter.image}
    />
  );
}
