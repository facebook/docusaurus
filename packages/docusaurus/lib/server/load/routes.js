/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {genChunkName, docuHash} = require('@docusaurus/utils');
const {stringify} = require('querystring');
const _ = require('lodash');

async function loadRoutes(pluginsRouteConfigs) {
  const routesImports = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
    `import NotFound from '@theme/NotFound';`,
    `import ContentRenderer from '@docusaurus/ContentRenderer';`,
  ];
  // Routes paths. Example: ['/', '/docs', '/blog/2017/09/03/test']
  const routesPaths = [];
  const addRoutesPath = routePath => {
    routesPaths.push(routePath);
  };

  // Mapping of routePath -> metadataPath. Example: '/blog' -> '@generated/metadata/blog-c06.json'
  const routesMetadataPath = {};
  const addRoutesMetadataPath = routePath => {
    const fileName = `${docuHash(routePath)}.json`;
    routesMetadataPath[routePath] = `@generated/metadata/${fileName}`;
  };

  // Mapping of routePath -> metadata. Example: '/blog' -> { isBlogPage: true, permalink: '/blog' }
  const routesMetadata = {};
  const addRoutesMetadata = (routePath, metadata) => {
    if (metadata) {
      routesMetadata[routePath] = metadata;
    }
  };

  const registry = {};

  // Mapping of routePath -> async imported modules. Example: '/blog' -> ['@theme/BlogPage']
  const routesAsyncModules = {};
  const addRoutesAsyncModule = (routePath, key, importChunk) => {
    // TODO: Port other plugins to use routeModules and not rely on this.
    if (!routesAsyncModules[routePath]) {
      routesAsyncModules[routePath] = {};
    }
    routesAsyncModules[routePath][key] = importChunk.chunkName;
    registry[importChunk.chunkName] = importChunk.importStatement;
  };

  // This is the higher level overview of route code generation
  function generateRouteCode(routeConfig) {
    const {
      path: routePath,
      component,
      metadata,
      modules = [],
      routeModules = {},
      routes,
    } = routeConfig;

    addRoutesPath(routePath);
    addRoutesMetadata(routePath, metadata);
    addRoutesMetadataPath(routePath);

    // Given an input (object or string), get the import path str
    const getModulePath = target => {
      const importStr = _.isObject(target) ? target.path : target;
      const queryStr = target.query ? `?${stringify(target.query)}` : '';

      return `${importStr}${queryStr}`;
    };

    if (!component) {
      throw new Error(`path: ${routePath} need a component`);
    }
    const componentPath = getModulePath(component);

    const genImportChunk = (modulePath, prefix, name) => {
      const chunkName = genChunkName(modulePath, prefix, name);
      const finalStr = JSON.stringify(modulePath);
      return {
        chunkName,
        importStatement: `() => import(/* webpackChunkName: '${chunkName}' */ ${finalStr})`,
      };
    };

    const componentChunk = genImportChunk(componentPath, 'component');
    addRoutesAsyncModule(routePath, 'component', componentChunk);

    if (routes) {
      const componentStr = `Loadable({
    loader: ${componentChunk.importStatement},
    loading: Loading
  })`;
      return `
{
  path: '${routePath}',
  component: ${componentStr},
  routes: [${routes.map(generateRouteCode).join(',')}],
}`;
    }

    const modulesImportStr = modules
      .map((module, i) => {
        const modulePath = getModulePath(module);
        const moduleChunk = genImportChunk(modulePath, i, routePath);
        return `Mod${i}: ${moduleChunk.importStatement},`;
      })
      .join('\n');

    function genRouteAsyncModule(value) {
      if (Array.isArray(value)) {
        return value.map(genRouteAsyncModule);
      }

      if (_.isObject(value) && !value.__import) {
        const newValue = {};
        Object.keys(value).forEach(key => {
          newValue[key] = genRouteAsyncModule(value[key]);
        });
        return newValue;
      }

      const importChunk = genImportChunk(
        getModulePath(value),
        'module',
        routePath,
      );
      registry[importChunk.chunkName] = importChunk.importStatement;
      return importChunk.chunkName;
    }

    _.assign(routesAsyncModules[routePath], genRouteAsyncModule(routeModules));

    const modulesLoadedStr = modules
      .map((module, i) => `loaded.Mod${i}.default,`)
      .join('\n');

    let metadataImportStr = '';
    if (metadata) {
      const metadataPath = routesMetadataPath[routePath];
      const metadataChunk = genImportChunk(metadataPath, 'metadata', routePath);
      addRoutesAsyncModule(routePath, 'metadata', metadataChunk);
      metadataImportStr = `metadata: ${metadataChunk.importStatement},`;
    }

    const componentStr = `Loadable.Map({
  loader: {
    ${modulesImportStr}
    ${metadataImportStr}
    Component: ${componentChunk.importStatement},
  },
  loading: Loading,
  render(loaded, props) {
    const Component = loaded.Component.default;
    const metadata = loaded.metadata || {};
    const modules = [${modulesLoadedStr}];
    return (
      <Component {...props} metadata={metadata} modules={modules}/>
    );
  }
})\n`;

    if (/^\/blog/.test(routePath)) {
      return `
      {
        path: '${routePath}',
        exact: true,
        component: ContentRenderer('${routePath}')
      }`;
    }

    return `
{
  path: '${routePath}',
  exact: true,
  component: ${componentStr}
}`;
  }

  const routes = pluginsRouteConfigs.map(generateRouteCode);
  const notFoundRoute = `
  {
    path: '*',
    component: NotFound
  }`;

  const routesConfig = `
${routesImports.join('\n')}

export default [
  ${routes.join(',')},
  ${notFoundRoute}
];\n`;

  return {
    registry,
    routesAsyncModules,
    routesConfig,
    routesMetadata,
    routesMetadataPath,
    routesPaths,
  };
}

module.exports = loadRoutes;
