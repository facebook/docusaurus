/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@generated/client-modules' {
  import type {ClientModule} from '@docusaurus/types';

  const clientModules: readonly (ClientModule & {default?: ClientModule})[];
  export default clientModules;
}

declare module '@generated/docusaurus.config' {
  import type {DocusaurusConfig} from '@docusaurus/types';

  const config: DocusaurusConfig;
  export default config;
}

declare module '@generated/site-metadata' {
  import type {SiteMetadata} from '@docusaurus/types';

  const siteMetadata: SiteMetadata;
  export = siteMetadata;
}

declare module '@generated/registry' {
  import type {Registry} from '@docusaurus/types';

  const registry: Registry;
  export default registry;
}

declare module '@generated/routes' {
  import type {RouteConfig as RRRouteConfig} from 'react-router-config';
  import type Loadable from 'react-loadable';

  type RouteConfig = RRRouteConfig & {
    path: string;
    component: ReturnType<typeof Loadable>;
  };
  const routes: RouteConfig[];
  export default routes;
}

declare module '@generated/routesChunkNames' {
  import type {RouteChunkNames} from '@docusaurus/types';

  const routesChunkNames: RouteChunkNames;
  export = routesChunkNames;
}

declare module '@generated/globalData' {
  import type {GlobalData} from '@docusaurus/types';

  const globalData: GlobalData;
  export = globalData;
}

declare module '@generated/i18n' {
  import type {I18n} from '@docusaurus/types';

  const i18n: I18n;
  export = i18n;
}

declare module '@generated/codeTranslations' {
  import type {CodeTranslations} from '@docusaurus/types';

  const codeTranslations: CodeTranslations;
  export = codeTranslations;
}

declare module '@theme-original/*';
declare module '@theme-init/*';

declare module '@theme/Error' {
  import type {FallbackParams} from '@docusaurus/ErrorBoundary';

  export interface Props extends FallbackParams {}
  export default function Error(props: Props): JSX.Element;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly children?: ReactNode;
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

declare module '@theme/SiteMetadata' {
  export default function SiteMetadata(): JSX.Element;
}

declare module '@docusaurus/constants' {
  export const DEFAULT_PLUGIN_ID: 'default';
}

declare module '@docusaurus/ErrorBoundary' {
  import type {ReactNode} from 'react';

  export type FallbackParams = {
    readonly error: Error;
    readonly tryAgain: () => void;
  };

  export type FallbackFunction = (params: FallbackParams) => JSX.Element;

  export interface Props {
    readonly fallback?: FallbackFunction;
    readonly children: ReactNode;
  }
  export default function ErrorBoundary(props: Props): JSX.Element;
}

declare module '@docusaurus/Head' {
  import type {ReactNode} from 'react';
  import type {HelmetProps} from 'react-helmet-async';

  export type Props = HelmetProps & {children: ReactNode};

  export default function Head(props: Props): JSX.Element;
}

declare module '@docusaurus/Link' {
  import type {CSSProperties, ComponentProps} from 'react';
  import type {NavLinkProps as RRNavLinkProps} from 'react-router-dom';

  type NavLinkProps = Partial<RRNavLinkProps>;
  export type Props = NavLinkProps &
    ComponentProps<'a'> & {
      readonly className?: string;
      readonly style?: CSSProperties;
      readonly isNavLink?: boolean;
      readonly to?: string;
      readonly href?: string;
      readonly autoAddBaseUrl?: boolean;

      /** Escape hatch in case broken links check doesn't make sense. */
      readonly 'data-noBrokenLinkCheck'?: boolean;
    };
  export default function Link(props: Props): JSX.Element;
}

declare module '@docusaurus/Interpolate' {
  import type {ReactNode} from 'react';

  export type ExtractInterpolatePlaceholders<Str extends string> =
    Str extends `${string}{${infer Key}}${infer Rest}`
      ? Key | ExtractInterpolatePlaceholders<Rest>
      : never;

  export type InterpolateValues<Str extends string, Value extends ReactNode> = {
    [key in ExtractInterpolatePlaceholders<Str>]: Value;
  };

  // If all the values are plain strings, interpolate returns a simple string
  export function interpolate<Str extends string>(
    text: Str,
    values?: InterpolateValues<Str, string | number>,
  ): string;

  // If values contain any ReactNode, the return is a ReactNode
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
  type IdOrMessage<
    MessageKey extends 'children' | 'message',
    Str extends string,
  > =
    | ({[key in MessageKey]: Str} & {id?: string})
    | ({[key in MessageKey]?: Str} & {id: string});

  export type TranslateParam<Str extends string> = IdOrMessage<
    'message',
    Str
  > & {
    description?: string;
  };

  export function translate<Str extends string>(
    param: TranslateParam<Str>,
    values?: InterpolateValues<Str, string | number>,
  ): string;

  export type TranslateProps<Str extends string> = IdOrMessage<
    'children',
    Str
  > & {
    description?: string;
    values?: InterpolateValues<Str, ReactNode>;
  };

  export default function Translate<Str extends string>(
    props: TranslateProps<Str>,
  ): JSX.Element;
}

declare module '@docusaurus/router' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  export {useHistory, useLocation, Redirect, matchPath} from 'react-router-dom';
}

declare module '@docusaurus/useDocusaurusContext' {
  import type {DocusaurusContext} from '@docusaurus/types';

  export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/useRouteContext' {
  import type {PluginRouteContext} from '@docusaurus/types';

  export default function useRouteContext(): PluginRouteContext;
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

  export default function ComponentCreator(
    path: string,
    hash: string,
  ): ReturnType<typeof Loadable>;
}

declare module '@docusaurus/BrowserOnly' {
  export interface Props {
    readonly children?: () => JSX.Element;
    readonly fallback?: JSX.Element;
  }
  export default function BrowserOnly(props: Props): JSX.Element | null;
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
  import type {GlobalData, UseDataOptions} from '@docusaurus/types';

  export function useAllPluginInstancesData(
    pluginName: string,
    options: {failfast: true},
  ): GlobalData[string];

  export function useAllPluginInstancesData(
    pluginName: string,
    options?: UseDataOptions,
  ): GlobalData[string] | undefined;

  export function usePluginData(
    pluginName: string,
    pluginId: string | undefined,
    options: {failfast: true},
  ): NonNullable<GlobalData[string][string]>;

  export function usePluginData(
    pluginName: string,
    pluginId?: string,
    options?: UseDataOptions,
  ): GlobalData[string][string];

  export default function useGlobalData(): GlobalData;
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

interface Window {
  docusaurus: {
    prefetch: (url: string) => false | Promise<void[]>;
    preload: (url: string) => false | Promise<void[]>;
  };
}
