/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ShowcaseItems,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';
import type {PluginContentLoadedActions} from '@docusaurus/types';

export async function processContentLoaded({
  content,
  tags,
  routeBasePath,
  addRoute,
}: {
  content: ShowcaseItems;
  routeBasePath: string;
  tags: TagsOption;
  addRoute: PluginContentLoadedActions['addRoute'];
}): Promise<void> {
  addRoute({
    path: routeBasePath,
    component: '@theme/Showcase',
    props: {
      items: content.items,
      tags,
    },
    exact: true,
  });
}
