import type {ReactElement} from 'react';
import type {PageCollectedData} from '../../common';
import {RouteBuildMetadata} from '@docusaurus/types';

type BuildMetaTag = {name?: string; content?: string};

function getBuildMetaTags(
  pageCollectedData: PageCollectedData,
): BuildMetaTag[] {
  // @ts-expect-error: see  https://github.com/staylor/react-helmet-async/pull/167
  const metaElements: ReactElement<BuildMetaTag>[] =
    pageCollectedData.helmet.meta.toComponent() ?? [];
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

export function toRouteBuildMetadata(
  pageCollectedData: PageCollectedData,
): RouteBuildMetadata {
  const tags = getBuildMetaTags(pageCollectedData);
  const noIndex = tags.some(isNoIndexTag);
  return {noIndex};
}
