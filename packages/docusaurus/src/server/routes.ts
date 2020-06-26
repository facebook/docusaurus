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
} from '@docusaurus/utils';
import has from 'lodash.has';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import {stringify} from 'querystring';
import {
  ChunkRegistry,
  Module,
  RouteConfig,
  RouteModule,
  ChunkNames,
} from '@docusaurus/types';

const createRouteCodeString = ({
  routePath,
  routeHash,
  exact,
  subroutesCodeStrings,
}: {
  routePath: string;
  routeHash: string;
  exact?: boolean;
  subroutesCodeStrings?: string[];
}) => {
  return removeSuffix(
    `
{
  path: '${routePath}',
  component: ComponentCreator('${routePath}','${routeHash}'),
  ${exact ? `exact: true,` : ''}
  ${
    subroutesCodeStrings
      ? `  routes: [
    ${removeSuffix(subroutesCodeStrings.join(',\n'), ',\n')},
  ]
`
      : ''
  }
}`,
    '',
  );
};

const NotFoundRouteCode = `
  {
    path: '*',
    component: ComponentCreator('*')
  }`;

const RoutesImportsCode = [
  `import React from 'react';`,
  `import ComponentCreator from '@docusaurus/ComponentCreator';`,
].join('\n');

function isModule(value: unknown): value is Module {
  if (isString(value)) {
    return true;
  }
  if (isPlainObject(value) && has(value, '__import') && has(value, 'path')) {
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

type LoadedRoutes = {
  registry: {
    [chunkName: string]: ChunkRegistry;
  };
  routesConfig: string;
  routesChunkNames: {
    [routePath: string]: ChunkNames;
  };
  routesPaths: string[];
};

export default async function loadRoutes(
  pluginsRouteConfigs: RouteConfig[],
  baseUrl: string,
): Promise<LoadedRoutes> {
  const registry: {
    [chunkName: string]: ChunkRegistry;
  } = {};
  const routesPaths: string[] = [normalizeUrl([baseUrl, '404.html'])];
  const routesChunkNames: {
    [routePath: string]: ChunkNames;
  } = {};

  // This is the higher level overview of route code generation.
  function generateRouteCode(routeConfig: RouteConfig): string {
    const {
      path: routePath,
      component,
      modules = {},
      routes: subroutes,
      exact,
    } = routeConfig;

    if (!isString(routePath) || !component) {
      throw new Error(
        `Invalid routeConfig (Path must be a string and component is required) \n${JSON.stringify(
          routeConfig,
        )}`,
      );
    }

    if (!subroutes) {
      routesPaths.push(routePath);
    }

    // We hash the route to generate the key, because 2 routes can conflict
    // with each others if they have the same path
    // see https://github.com/facebook/docusaurus/issues/2917
    const routeHash = simpleHash(JSON.stringify(routeConfig), 3);
    const chunkNamesKey = `${routePath}-${routeHash}`;

    routesChunkNames[chunkNamesKey] = {
      ...routesChunkNames[chunkNamesKey],
      ...genRouteChunkNames(registry, {component}, 'component', component),
      ...genRouteChunkNames(registry, modules, 'module', routePath),
    };

    return createRouteCodeString({
      routePath: routeConfig.path,
      routeHash,
      exact,
      subroutesCodeStrings: subroutes?.map(generateRouteCode),
    });
  }

  const routesConfig = `
${RoutesImportsCode}
export default [
  ${pluginsRouteConfigs.map(generateRouteCode).join(',')},
  ${NotFoundRouteCode}
];\n`;

  return {
    registry,
    routesConfig,
    routesChunkNames,
    routesPaths,
  };
}

function genRouteChunkNames(
  // TODO instead of passing a mutating the registre, return a registry slice?
  registry: {
    [chunkName: string]: ChunkRegistry;
  },
  value: RouteModule | RouteModule[] | Module | null | undefined,
  prefix?: string,
  name?: string,
) {
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
    // We need to JSON.stringify so that if its on windows, backslashes are escaped.
    const loader = `() => import(/* webpackChunkName: '${chunkName}' */ ${JSON.stringify(
      modulePath,
    )})`;

    registry[chunkName] = {
      loader,
      modulePath,
    };
    return chunkName;
  }

  const newValue: ChunkNames = {};
  Object.keys(value).forEach((key) => {
    newValue[key] = genRouteChunkNames(registry, value[key], key, name);
  });
  return newValue;
}
