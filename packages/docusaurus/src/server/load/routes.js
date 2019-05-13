/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {genChunkName} = require('@docusaurus/utils');
const {stringify} = require('querystring');
const _ = require('lodash');

async function loadRoutes(pluginsRouteConfigs) {
  const routesImports = [
    `import React from 'react';`,
    `import ComponentCreator from '@docusaurus/ComponentCreator';`,
  ];
  const routesPaths = [];
  const addRoutesPath = routePath => {
    routesPaths.push(routePath);
  };

  const registry = {};

  const routesChunkNames = {};
  const addRoutesChunkNames = (routePath, key, importChunk) => {
    if (!routesChunkNames[routePath]) {
      routesChunkNames[routePath] = {};
    }
    routesChunkNames[routePath][key] = importChunk.chunkName;
    registry[importChunk.chunkName] = {
      importStatement: importChunk.importStatement,
      modulePath: importChunk.modulePath,
    };
  };

  // This is the higher level overview of route code generation
  function generateRouteCode(routeConfig) {
    const {
      path: routePath,
      component,
      modules = {},
      routes,
      exact,
    } = routeConfig;

    if (!routes) {
      addRoutesPath(routePath);
    }

    // Given an input (object or string), get the import path str
    const getModulePath = target => {
      if (!target) {
        return null;
      }

      const importStr = _.isObject(target) ? target.path : target;
      const queryStr = target.query ? `?${stringify(target.query)}` : '';
      return `${importStr}${queryStr}`;
    };

    if (!component) {
      throw new Error(`path: ${routePath} need a component`);
    }

    const componentPath = getModulePath(component);

    const genImportChunk = (modulePath, prefix, name) => {
      if (!modulePath) {
        return null;
      }

      const chunkName = genChunkName(modulePath, prefix, name);
      const finalStr = JSON.stringify(modulePath);
      return {
        chunkName,
        modulePath,
        importStatement: `() => import(/* webpackChunkName: '${chunkName}' */ ${finalStr})`,
      };
    };

    const componentChunk = genImportChunk(componentPath, 'component');
    addRoutesChunkNames(routePath, 'component', componentChunk);

    function genRouteChunkNames(value, prefix) {
      if (Array.isArray(value)) {
        return value.map(genRouteChunkNames);
      }

      if (_.isObject(value) && !value.__import) {
        const newValue = {};
        Object.keys(value).forEach(key => {
          newValue[key] = genRouteChunkNames(value[key], key);
        });
        return newValue;
      }

      const importChunk = genImportChunk(
        getModulePath(value),
        prefix,
        routePath,
      );

      if (!importChunk) {
        return null;
      }

      registry[importChunk.chunkName] = {
        importStatement: importChunk.importStatement,
        modulePath: importChunk.modulePath,
      };
      return importChunk.chunkName;
    }

    _.assign(routesChunkNames[routePath], genRouteChunkNames(modules));

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

module.exports = loadRoutes;
