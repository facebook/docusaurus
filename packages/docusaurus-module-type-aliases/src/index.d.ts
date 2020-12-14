/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@generated/client-modules' {
  const clientModules: readonly any[];
  export default clientModules;
}

declare module '@generated/docusaurus.config' {
  const config: any;
  export default config;
}

declare module '@generated/site-metadata' {
  const siteMetadata: any;
  export default siteMetadata;
}

declare module '@generated/registry' {
  const registry: {
    readonly [key: string]: [() => Promise<any>, string, string];
  };
  export default registry;
}

declare module '@generated/routes' {
  type Route = {
    readonly path: string;
    readonly component: any;
    readonly exact?: boolean;
  };
  const routes: Route[];
  export default routes;
}

declare module '@generated/routesChunkNames' {
  const routesChunkNames: Record<string, Record<string, string>>;
  export default routesChunkNames;
}

declare module '@generated/globalData' {
  const globalData: any;
  export default globalData;
}

declare module '@generated/i18n' {
  const i18n: {
    defaultLocale: string;
    locales: [string, ...string[]];
    currentLocale: string;
    localeConfigs: Record<string, {label: string}>;
  };
  export default i18n;
}

declare module '@generated/codeTranslations' {
  const codeTranslations: Record<string, string>;
  export default codeTranslations;
}

declare module '@theme/*';

declare module '@theme-original/*';

declare module '@docusaurus/*';

declare module '@docusaurus/Head' {
  const helmet: typeof import('react-helmet').Helmet;
  export default helmet;
}

declare module '@docusaurus/Link' {
  type RRLinkProps = Partial<import('react-router-dom').LinkProps>;
  type LinkProps = RRLinkProps & {
    to?: string;
    activeClassName?: string;
    isNavLink?: boolean;
  };
  const Link: (props: LinkProps) => JSX.Element;
  export default Link;
}

declare module '@docusaurus/Translate' {
  type TranslateProps = {children: string; id?: string; description?: string};
  const Translate: (props: TranslateProps) => JSX.Element;
  export default Translate;

  export function translate(param: {
    message: string;
    id?: string;
    description?: string;
  }): string;
}

declare module '@docusaurus/router' {
  export const Redirect: (props: {to: string}) => import('react').Component;
  export function matchPath(
    pathname: string,
    opts: {path?: string; exact?: boolean; strict?: boolean},
  ): boolean;
  export function useLocation(): Location;
}

declare module '@docusaurus/useDocusaurusContext' {
  export default function (): any;
}

declare module '@docusaurus/useBaseUrl' {
  export default function (
    relativePath: string | undefined,
    opts?: {absolute?: true; forcePrependBaseUrl?: true},
  ): string;
}

declare module '*.module.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
