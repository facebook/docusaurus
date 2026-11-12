/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactElement} from 'react';
import type {PageCollectedMetadataInternal} from '../common';
import type {HelmetServerState} from 'react-helmet-async';

type BuildMetaTag = {name?: string; content?: string};

function getBuildMetaTags(helmet: HelmetServerState): BuildMetaTag[] {
  const metaElements =
    helmet.meta.toComponent() as ReactElement<BuildMetaTag>[];
  return metaElements.map((el) => el.props);
}

function isNoIndexTag(tag: BuildMetaTag): boolean {
  if (!tag.name || !tag.content) {
    return false;
  }
  return (
    // meta name is not case-sensitive
    tag.name.toLowerCase() === 'robots' &&
    // Robots directives are not case-sensitive
    tag.content.toLowerCase().includes('noindex')
  );
}

export function toPageCollectedMetadataInternal({
  helmet,
}: {
  helmet: HelmetServerState | null | undefined;
}): PageCollectedMetadataInternal {
  // React 19: react-helmet-async v3 renders the tags and doesn't fill helmet
  // See https://github.com/staylor/react-helmet-async#react-19
  if (!helmet) {
    return {
      public: {noIndex: false},
      internal: {
        htmlAttributes: '',
        bodyAttributes: '',
        title: '',
        meta: '',
        link: '',
        script: '',
      },
    };
  }
  const tags = getBuildMetaTags(helmet);
  const noIndex = tags.some(isNoIndexTag);

  return {
    public: {
      noIndex,
    },
    internal: {
      htmlAttributes: helmet.htmlAttributes.toString(),
      bodyAttributes: helmet.bodyAttributes.toString(),
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
    },
  };
}
