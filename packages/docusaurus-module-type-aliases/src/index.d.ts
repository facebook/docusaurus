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
  const globalData: Record<string, unknown>;
  export default globalData;
}

declare module '@generated/i18n' {
  const i18n: {
    defaultLocale: string;
    locales: [string, ...string[]];
    currentLocale: string;
    localeConfigs: Record<string, {label: string; direction: string}>;
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
  import type {HelmetProps} from 'react-helmet';
  import type {ReactNode} from 'react';

  export type HeadProps = HelmetProps & {children: ReactNode};

  const Head: (props: HeadProps) => JSX.Element;
  export default Head;
}

declare module '@docusaurus/Link' {
  import type {ReactNode} from 'react';

  type RRLinkProps = Partial<import('react-router-dom').LinkProps>;
  export type LinkProps = RRLinkProps & {
    readonly isNavLink?: boolean;
    readonly to?: string;
    readonly href?: string;
    readonly activeClassName?: string;
    readonly children?: ReactNode;
    readonly isActive?: (match: any, location: any) => boolean;
    readonly autoAddBaseUrl?: boolean;

    // escape hatch in case broken links check is annoying for a specific link
    readonly 'data-noBrokenLinkCheck'?: boolean;
  };
  const Link: (props: LinkProps) => JSX.Element;
  export default Link;
}

declare module '@docusaurus/Interpolate' {
  import type {ReactNode} from 'react';

  // TODO use TS template literal feature to make values typesafe!
  // (requires upgrading TS first)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export type ExtractInterpolatePlaceholders<Str extends string> = string;

  export type InterpolateValues<
    Str extends string,
    Value extends ReactNode
  > = Record<ExtractInterpolatePlaceholders<Str>, Value>;

  // TS function overload: if all the values are plain strings, then interpolate returns a simple string
  export function interpolate<Str extends string>(
    text: Str,
    values?: InterpolateValues<Str, string | number>,
  ): string;

  // If values contain any ReactNode, then the return is a ReactNode
  export function interpolate<Str extends string, Value extends ReactNode>(
    text: Str,
    values?: InterpolateValues<Str, Value>,
  ): ReactNode;

  export type InterpolateProps<Str extends string> = {
    children: Str;
    values?: InterpolateValues<Str, ReactNode>;
  };

  export default function Interpolate<Str extends string>(
    props: InterpolateProps<Str>,
  ): JSX.Element;
}

declare module '@docusaurus/Translate' {
  import type {
    InterpolateProps,
    InterpolateValues,
  } from '@docusaurus/Interpolate';

  export type TranslateParam<Str extends string> = Partial<
    InterpolateProps<Str>
  > & {
    message: Str;
    id?: string;
    description?: string;
    values?: InterpolateValues<Str, string | number>;
  };

  export function translate<Str extends string>(
    param: TranslateParam<Str>,
    values?: InterpolateValues<Str, string | number>,
  ): string;

  export type TranslateProps<Str extends string> = InterpolateProps<Str> & {
    id?: string;
    description?: string;
  };

  export default function Translate<Str extends string>(
    props: TranslateProps<Str>,
  ): JSX.Element;
}

declare module '@docusaurus/router' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  export * from 'react-router-dom';
}

declare module '@docusaurus/useDocusaurusContext' {
  export default function (): any;
}

declare module '@docusaurus/useBaseUrl' {
  export type BaseUrlOptions = {
    forcePrependBaseUrl?: boolean;
    absolute?: boolean;
  };

  export type BaseUrlUtils = {
    withBaseUrl: (url: string, options?: BaseUrlOptions) => string;
  };

  export function useBaseUrlUtils(): BaseUrlUtils;

  export default function useBaseUrl(
    relativePath: string | undefined,
    opts?: BaseUrlOptions,
  ): string;
}

declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    canUseDOM: boolean;
    canUseEventListeners: boolean;
    canUseIntersectionObserver: boolean;
    canUseViewport: boolean;
  };
  export default ExecutionEnvironment;
}

declare module '@docusaurus/ComponentCreator' {
  import type Loadable from 'react-loadable';

  function ComponentCreator(
    path: string,
    hash: string,
  ): ReturnType<typeof Loadable>;
  export default ComponentCreator;
}

declare module '@docusaurus/BrowserOnly' {
  export type Props = {
    children?: () => JSX.Element;
    fallback?: JSX.Element;
  };
  const BrowserOnly: (props: Props) => JSX.Element | null;
  export default BrowserOnly;
}

declare module '@docusaurus/isInternalUrl' {
  export function hasProtocol(url: string): boolean;
  export default function isInternalUrl(url?: string): boolean;
}

declare module '@docusaurus/Noop' {
  export default function (): null;
}

declare module '@docusaurus/renderRoutes' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import {renderRoutes} from 'react-router-config';

  export default renderRoutes;
}

declare module '@docusaurus/useGlobalData' {
  export function useAllPluginInstancesData<T = unknown>(
    pluginName: string,
  ): Record<string, T>;

  export function usePluginData<T = unknown>(
    pluginName: string,
    pluginId?: string,
  ): T;

  function useGlobalData(): Record<string, any>;
  export default useGlobalData;
}

declare module '*.module.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
