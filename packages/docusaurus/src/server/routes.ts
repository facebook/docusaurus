/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {genChunkName, normalizeUrl} from '@docusaurus/utils';
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

function isModule(value: any): value is Module {
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

export default async function loadRoutes(
  pluginsRouteConfigs: RouteConfig[],
  baseUrl: string,
) {
  const routesImports = [
    `import React from 'react';`,
    `import ComponentCreator from '@docusaurus/ComponentCreator';`,
  ];
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
      routes,
      exact,
    } = routeConfig;

    if (!isString(routePath) || !component) {
      throw new Error(
        `Invalid routeConfig (Path must be a string and component is required) \n${JSON.stringify(
          routeConfig,
        )}`,
      );
    }

    if (!routes) {
      routesPaths.push(routePath);
    }

    function genRouteChunkNames(
      value: RouteModule | RouteModule[] | Module | null | undefined,
      prefix?: string,
      name?: string,
    ) {
      if (!value) {
        return null;
      }

      if (Array.isArray(value)) {
        return value.map((val, index) =>
          genRouteChunkNames(val, `${index}`, name),
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
        newValue[key] = genRouteChunkNames(value[key], key, name);
      });
      return newValue;
    }

    routesChunkNames[routePath] = Object.assign(
      {},
      routesChunkNames[routePath],
      genRouteChunkNames({component}, 'component', component),
      genRouteChunkNames(modules, 'module', routePath),
    );

    const routesStr = routes
      ? `routes: [${routes.map(generateRouteCode).join(',')}],`
      : '';
    const exactStr = exact ? `exact: true,` : '';

    return `
{
  path: '${routePath}',
  component: ComponentCreator('${routePath}'),
  ${exactStr}
  ${routesStr}
}`;
  }

  const routes = pluginsRouteConfigs.map(generateRouteCode);
  const notFoundRoute = `
  {
    path: '*',
    component: ComponentCreator('*')
  }`;

  const routesConfig = `
${routesImports.join('\n')}

export default [
  ${routes.join(',')},
  ${notFoundRoute}
];\n`;

  return {
    registry,
    routesConfig,
    routesChunkNames,
    routesPaths,
  };
}
