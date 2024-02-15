/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useRouteContext from '@docusaurus/useRouteContext';
import type {BlogMetadata} from '@docusaurus/plugin-content-blog';

export function useBlogMetadata(): BlogMetadata {
  const routeContext = useRouteContext();
  const blogMetadata = routeContext?.data?.blogMetadata;
  if (!blogMetadata) {
    throw new Error(
      "useBlogMetadata() can't be called on the current route because the blog metadata could not be found in route context",
    );
  }
  return blogMetadata as BlogMetadata;
}
