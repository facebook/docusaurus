import type {ReactElement} from 'react';
import type {PageCollectedData} from '../../common';
import {RouteBuildMetadata} from '@docusaurus/types';
import {HelmetServerState} from 'react-helmet-async';
import logger from '@docusaurus/logger';

type BuildMetaTag = {name?: string; content?: string};

function getBuildMetaTags(
  pageCollectedData: PageCollectedData,
): BuildMetaTag[] {
  // @ts-expect-error: see  https://github.com/staylor/react-helmet-async/pull/167
  const metaElements: ReactElement<BuildMetaTag>[] =
    pageCollectedData.metadata.helmet?.meta.toComponent() ?? [];
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
  const {noIndex} = pageCollectedData.metadata;
  // We create a smaller object on purpose
  // PageCollectedData is an internal data structure
  // RouteBuildMetadata is a public API data structure used in postBuild()
  return {noIndex};
}

// TODO Docusaurus v4 remove old helmet APIs
//  see https://github.com/facebook/docusaurus/pull/10850
export function toDeprecatedHeadEntry(
  pageCollectedData: PageCollectedData,
): HelmetServerState {
  return (
    pageCollectedData.metadata.helmet ??
    (new Proxy(
      {},
      {
        get(target, prop) {
          throw new Error(
            logger.interpolate`Docusaurus detected the usage of legacy ${logger.code(
              'plugin.postBuild({head})',
            )} API. You get this error because you turned on a Docusaurus v4 future flag. If your site is not compatible, you can turn the flag off until you make it compatible.`,
          );
        },
      },
    ) as HelmetServerState)
  );
}
