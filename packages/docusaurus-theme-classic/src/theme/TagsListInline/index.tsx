/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/TagsListInline';

export default function TagsListInline({tags}: Props) {
  return (
    <>
      <b>
        <Translate
          id="theme.tags.tagsListLabel"
          description="The label alongside a tag list">
          Tags:
        </Translate>
      </b>
      {tags.map(({label, permalink: tagPermalink}) => (
        <Link key={tagPermalink} className="margin-horiz--sm" to={tagPermalink}>
          {label}
        </Link>
      ))}
    </>
  );
}
