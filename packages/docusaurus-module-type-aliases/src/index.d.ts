/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@generated/client-modules' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientModules: readonly any[];
  export default clientModules;
}

declare module '@generated/docusaurus.config' {
  import type {DocusaurusConfig} from '@docusaurus/types';

  const config: DocusaurusConfig;
  export default config;
}

declare module '@generated/site-metadata' {
  import type {DocusaurusSiteMetadata} from '@docusaurus/types';

  const siteMetadata: DocusaurusSiteMetadata;
  export = siteMetadata;
}

declare module '@generated/registry' {
  const registry: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [key: string]: [() => Promise<any>, string, string];
  };
  export default registry;
}

declare module '@generated/routes' {
  import type {RouteConfig} from 'react-router-config';

  type Route = {
    readonly path: string;
    readonly component: RouteConfig['component'];
    readonly exact?: boolean;
    readonly routes?: Route[];
  };
  const routes: Route[];
  export default routes;
}

declare module '@generated/routesChunkNames' {
  import type {RouteChunksTree} from '@docusaurus/types';

  const routesChunkNames: Record<string, RouteChunksTree>;
  export = routesChunkNames;
}

declare module '@generated/globalData' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalData: Record<string, any>;
  export = globalData;
}

declare module '@generated/i18n' {
  const i18n: {
    defaultLocale: string;
    locales: [string, ...string[]];
    currentLocale: string;
    localeConfigs: Record<string, {label: string; direction: string}>;
  };
  export = i18n;
}

declare module '@generated/codeTranslations' {
  const codeTranslations: Record<string, string>;
  export = codeTranslations;
}

declare module '@theme-original/*';

declare module '@theme/Error' {
  export interface Props {
    readonly error: Error;
    readonly tryAgain: () => void;
  }
  export default function Error(props: Props): JSX.Element;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
    readonly title?: string;
    readonly description?: string;
  }
  export default function Layout(props: Props): JSX.Element;
}

declare module '@theme/Loading' {
  import type {LoadingComponentProps} from 'react-loadable';

  export default function Loading(props: LoadingComponentProps): JSX.Element;
}

declare module '@theme/NotFound' {
  export default function NotFound(): JSX.Element;
}

declare module '@theme/Root' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children: ReactNode;
  }
  export default function Root({children}: Props): JSX.Element;
}

declare module '@docusaurus/constants' {
  export const DEFAULT_PLUGIN_ID: 'default';
}

declare module '@docusaurus/ErrorBoundary' {
  import type {ReactNode} from 'react';
  import type ErrorComponent from '@theme/Error';

  export interface Props {
    readonly fallback?: typeof ErrorComponent;
    readonly children: ReactNode;
  }
  export default function ErrorBoundary(props: Props): JSX.Element;
}

declare module '@docusaurus/Head' {
  import type {HelmetProps} from 'react-helmet';
  import type {ReactNode} from 'react';

  export type HeadProps = HelmetProps & {children: ReactNode};

  const Head: (props: HeadProps) => JSX.Element;
  export default Head;
}

declare module '@docusaurus/Link' {
  import type {CSSProperties, ComponentProps} from 'react';

  type NavLinkProps = Partial<import('react-router-dom').NavLinkProps>;
  export type LinkProps = NavLinkProps &
    ComponentProps<'a'> & {
      readonly className?: string;
      readonly style?: CSSProperties;
      readonly isNavLink?: boolean;
      readonly to?: string;
      readonly href?: string;
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
    Value extends ReactNode,
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
  import type {ReactNode} from 'react';
  import type {InterpolateValues} from '@docusaurus/Interpolate';

  // TS type to ensure that at least one of id or message is always provided
  // (Generic permits to handled message provided as React children)
  type IdOrMessage<MessageKey extends 'children' | 'message'> =
    | ({[key in MessageKey]: string} & {id?: string})
    | ({[key in MessageKey]?: string} & {id: string});

  export type TranslateParam<Str extends string> = IdOrMessage<'message'> & {
    description?: string;
    values?: InterpolateValues<Str, string | number>;
  };

  export function translate<Str extends string>(
    param: TranslateParam<Str>,
    values?: InterpolateValues<Str, string | number>,
  ): string;

  export type TranslateProps<Str extends string> = IdOrMessage<'children'> & {
    description?: string;
    values?: InterpolateValues<Str, ReactNode>;
  };

  export default function Translate<Str extends string>(
    props: TranslateProps<Str>,
  ): JSX.Element;
}

declare module '@docusaurus/router' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  export * from 'react-router-dom';
}
declare module '@docusaurus/history' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  export * from 'history';
}

declare module '@docusaurus/useDocusaurusContext' {
  import type {DocusaurusContext} from '@docusaurus/types';

  export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/useIsBrowser' {
  export default function useIsBrowser(): boolean;
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
  export interface Props {
    readonly children?: () => JSX.Element;
    readonly fallback?: JSX.Element;
  }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useGlobalData(): Record<string, any>;
  export default useGlobalData;
}

declare module '*.svg' {
  import type {ComponentType, SVGProps} from 'react';

  const ReactComponent: ComponentType<SVGProps<SVGSVGElement>>;

  export default ReactComponent;
}

declare module '*.module.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
