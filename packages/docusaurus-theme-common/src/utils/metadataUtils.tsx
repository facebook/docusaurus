/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import clsx from 'clsx';
import useRouteContext from '@docusaurus/useRouteContext';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {useTitleFormatter} from './generalUtils';

interface PageMetadataProps {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: readonly string[] | string;
  readonly image?: string;
  readonly children?: ReactNode;
}

// Helper component to manipulate page metadata and override site defaults
export function PageMetadata({
  title,
  description,
  keywords,
  image,
  children,
}: PageMetadataProps): JSX.Element {
  const pageTitle = useTitleFormatter(title);
  const {withBaseUrl} = useBaseUrlUtils();
  const pageImage = image ? withBaseUrl(image, {absolute: true}) : undefined;

  return (
    <Head>
      {title && <title>{pageTitle}</title>}
      {title && <meta property="og:title" content={pageTitle} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {keywords && (
        <meta
          name="keywords"
          content={
            (Array.isArray(keywords) ? keywords.join(',') : keywords) as string
          }
        />
      )}

      {pageImage && <meta property="og:image" content={pageImage} />}
      {pageImage && <meta name="twitter:image" content={pageImage} />}

      {children}
    </Head>
  );
}

const HtmlClassNameContext = React.createContext<string | undefined>(undefined);

// This wrapper is necessary because Helmet does not "merge" classes
// See https://github.com/staylor/react-helmet-async/issues/161
export function HtmlClassNameProvider({
  className: classNameProp,
  children,
}: {
  className: string;
  children: ReactNode;
}): JSX.Element {
  const classNameContext = React.useContext(HtmlClassNameContext);
  const className = clsx(classNameContext, classNameProp);
  return (
    <HtmlClassNameContext.Provider value={className}>
      <Head>
        <html className={className} />
      </Head>
      {children}
    </HtmlClassNameContext.Provider>
  );
}

function pluginNameToClassName(pluginName: string) {
  return `plugin-${pluginName.replace(
    /docusaurus-(?:plugin|theme)-(?:content-)?/gi,
    '',
  )}`;
}

export function PluginHtmlClassNameProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const routeContext = useRouteContext();
  const nameClass = pluginNameToClassName(routeContext.plugin.name);
  const idClass = `plugin-id-${routeContext.plugin.id}`;
  return (
    <HtmlClassNameProvider className={clsx(nameClass, idClass)}>
      {children}
    </HtmlClassNameProvider>
  );
}
