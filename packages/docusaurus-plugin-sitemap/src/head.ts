/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactElement} from 'react';
import type {HelmetServerState} from 'react-helmet-async';

// Maybe we want to add a routeConfig.metadata.noIndex instead?
// But using Helmet is more reliable for third-party plugins...
export function isNoIndexMetaRoute({
  head,
  route,
}: {
  head: {[location: string]: HelmetServerState};
  route: string;
}): boolean {
  const isNoIndexMetaTag = ({
    name,
    content,
  }: {
    name?: string;
    content?: string;
  }): boolean => {
    if (!name || !content) {
      return false;
    }
    return (
      // meta name is not case-sensitive
      name.toLowerCase() === 'robots' &&
      // Robots directives are not case-sensitive
      content.toLowerCase().includes('noindex')
    );
  };

  // https://github.com/staylor/react-helmet-async/pull/167
  const meta = head[route]?.meta.toComponent() as unknown as
    | ReactElement<{name?: string; content?: string}>[]
    | undefined;
  return (
    meta?.some((tag) =>
      isNoIndexMetaTag({name: tag.props.name, content: tag.props.content}),
    ) ?? false
  );
}
