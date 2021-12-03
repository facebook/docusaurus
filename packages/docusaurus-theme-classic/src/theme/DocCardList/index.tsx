/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DocCard from '@theme/DocCard';
import {PropSidebarItem} from '@docusaurus/plugin-content-docs';

export default function DocCardList({
  items,
}: {
  items: PropSidebarItem[];
}): JSX.Element {
  return (
    <div className="row">
      {items.map((item, index) => (
        <article key={index} className="col col--6">
          <DocCard item={item} />
        </article>
      ))}
    </div>
  );
}
