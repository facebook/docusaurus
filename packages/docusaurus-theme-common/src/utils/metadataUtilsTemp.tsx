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
