/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  genChunkName,
  normalizeUrl,
  removeSuffix,
  simpleHash,
  escapePath,
} from '@docusaurus/utils';
import {stringify} from 'querystring';
import type {
  ChunkRegistry,
  Module,
  RouteConfig,
  RouteModule,
  ChunkNames,
} from '@docusaurus/types';

type RegistryMap = {
  [chunkName: string]: ChunkRegistry;
};

function indent(str: string) {
  const spaces = '  ';
  return `${spaces}${str.replace(/\n/g, `\n${spaces}`)}`;
}

function createRouteCodeString({
  routePath,
  routeHash,
  exact,
  subroutesCodeStrings,
  props,
}: {
  routePath: string;
  routeHash: string;
  exact?: boolean;
  subroutesCodeStrings?: string[];
  props: {[propName: string]: unknown};
}) {
  const parts = [
    `path: '${routePath}'`,
    `component: ComponentCreator('${routePath}','${routeHash}')`,
  ];

  if (exact) {
    parts.push(`exact: true`);
  }

  if (subroutesCodeStrings) {
    parts.push(
      `routes: [
${indent(removeSuffix(subroutesCodeStrings.join(',\n'), ',\n'))}
]`,
    );
  }

  Object.entries(props).forEach(([propName, propValue]) => {
    // Inspired by https://github.com/armanozak/should-quote/blob/main/packages/should-quote/src/lib/should-quote.ts
    const shouldQuote = ((key: string) => {
      // Pre-sanitation to prevent injection
      if (/[.,;:}/\s]/.test(key)) {
        return true;
      }
      try {
        // If this key can be used in an expression like ({a:0}).a
        // eslint-disable-next-line no-eval
        eval(`({${key}:0}).${key}`);
        return false;
      } catch {
        return true;
      }
    })(propName);
    // Escape quotes as well
    const key = shouldQuote ? JSON.stringify(propName) : propName;
    parts.push(`${key}: ${JSON.stringify(propValue)}`);
  });

  return `{
${indent(parts.join(',\n'))}
}`;
}

const NotFoundRouteCode = `{
  path: '*',
  component: ComponentCreator('*')
}`;

const RoutesImportsCode = [
  `import React from 'react';`,
  `import ComponentCreator from '@docusaurus/ComponentCreator';`,
].join('\n');

function isModule(value: unknown): value is Module {
  if (typeof value === 'string') {
    return true;
  }
  if (
    typeof value === 'object' &&
    // eslint-disable-next-line no-underscore-dangle
    (value as {[key: string]: unknown})?.__import &&
    (value as {[key: string]: unknown})?.path
  ) {
    return true;
  }
  return false;
}

function getModulePath(target: Module): string {
  if (typeof target === 'string') {
    return target;
  }
  const queryStr = target.query ? `?${stringify(target.query)}` : '';
  return `${target.path}${queryStr}`;
}

export default async function loadRoutes(
  pluginsRouteConfigs: RouteConfig[],
  baseUrl: string,
): Promise<{
  registry: {[chunkName: string]: ChunkRegistry};
  routesConfig: string;
  routesChunkNames: {[routePath: string]: ChunkNames};
  routesPaths: string[];
}> {
  const registry: {[chunkName: string]: ChunkRegistry} = {};
  const routesPaths: string[] = [normalizeUrl([baseUrl, '404.html'])];
  const routesChunkNames: {[routePath: string]: ChunkNames} = {};

  // This is the higher level overview of route code generation.
  function generateRouteCode(routeConfig: RouteConfig): string {
    const {
      path: routePath,
      component,
      modules = {},
      routes: subroutes,
      exact,
      priority,
      ...props
    } = routeConfig;

    if (typeof routePath !== 'string' || !component) {
      throw new Error(
        `Invalid route config: path must be a string and component is required.
${JSON.stringify(routeConfig)}`,
      );
    }

    // Collect all page paths for injecting it later in the plugin lifecycle
    // This is useful for plugins like sitemaps, redirects etc...
    // If a route has subroutes, it is not necessarily a valid page path (more
    // likely to be a wrapper)
    if (!subroutes) {
      routesPaths.push(routePath);
    }

    // We hash the route to generate the key, because 2 routes can conflict with
    // each others if they have the same path, ex: parent=/docs, child=/docs
    // see https://github.com/facebook/docusaurus/issues/2917
    const routeHash = simpleHash(JSON.stringify(routeConfig), 3);
    const chunkNamesKey = `${routePath}-${routeHash}`;
    routesChunkNames[chunkNamesKey] = {
      ...genRouteChunkNames(registry, {component}, 'component', component),
      ...genRouteChunkNames(registry, modules, 'module', routePath),
    };

    return createRouteCodeString({
      routePath: routeConfig.path.replace(/'/g, "\\'"),
      routeHash,
      exact,
      subroutesCodeStrings: subroutes?.map(generateRouteCode),
      props,
    });
  }

  const routesConfig = `
${RoutesImportsCode}

export default [
${indent(`${pluginsRouteConfigs.map(generateRouteCode).join(',\n')},`)}
${indent(NotFoundRouteCode)}
];
`;

  return {
    registry,
    routesConfig,
    routesChunkNames,
    routesPaths,
  };
}

function genRouteChunkNames(
  registry: RegistryMap,
  value: Module,
  prefix?: string,
  name?: string,
): string;
function genRouteChunkNames(
  registry: RegistryMap,
  value: RouteModule,
  prefix?: string,
  name?: string,
): ChunkNames;
function genRouteChunkNames(
  registry: RegistryMap,
  value: RouteModule[],
  prefix?: string,
  name?: string,
): ChunkNames[];
function genRouteChunkNames(
  registry: RegistryMap,
  value: RouteModule | RouteModule[] | Module,
  prefix?: string,
  name?: string,
): ChunkNames | ChunkNames[] | string;

function genRouteChunkNames(
  // TODO instead of passing a mutating the registry, return a registry slice?
  registry: RegistryMap,
  value: RouteModule | RouteModule[] | Module | null | undefined,
  prefix?: string,
  name?: string,
): null | string | ChunkNames | ChunkNames[] {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((val, index) =>
      genRouteChunkNames(registry, val, `${index}`, name),
    );
  }

  if (isModule(value)) {
    const modulePath = getModulePath(value);
    const chunkName = genChunkName(modulePath, prefix, name);
    const loader = `() => import(/* webpackChunkName: '${chunkName}' */ '${escapePath(
      modulePath,
    )}')`;

    registry[chunkName] = {loader, modulePath};
    return chunkName;
  }

  const newValue: ChunkNames = {};
  Object.entries(value).forEach(([key, v]) => {
    newValue[key] = genRouteChunkNames(registry, v, key, name);
  });
  return newValue;
}
