/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {genChunkName, docuHash} = require('@docusaurus/utils');
const {stringify} = require('querystring');

async function loadRoutes(pluginsRouteConfigs) {
  const routesImports = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
    `import NotFound from '@theme/NotFound';`,
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
  // Mapping of routePath -> async imported modules. Example: '/blog' -> ['@theme/BlogPage']
  const routesAsyncModules = {};
  const addRoutesAsyncModule = (routePath, module) => {
    if (!routesAsyncModules[routePath]) {
      routesAsyncModules[routePath] = [];
    }
    routesAsyncModules[routePath].push(module);
  };

  // This is the higher level overview of route code generation
  function generateRouteCode(routeConfig) {
    const {
      path: routePath,
      component,
      metadata,
      modules = [],
      routes,
    } = routeConfig;

    addRoutesPath(routePath);
    addRoutesMetadata(routePath, metadata);
    addRoutesMetadataPath(routePath);

    // Given an input (object or string), get the import path str
    const getModulePath = target => {
      const isObj = typeof target === 'object';
      const importStr = isObj ? target.path : target;
      const queryStr = target.query ? `?${stringify(target.query)}` : '';
      return `${importStr}${queryStr}`;
    };

    if (!component) {
      throw new Error(`path: ${routePath} need a component`);
    }
    const componentPath = getModulePath(component);
    addRoutesAsyncModule(routePath, componentPath);

    const genImportStr = (modulePath, prefix, name) => {
      const chunkName = genChunkName(name || modulePath, prefix);
      const finalStr = JSON.stringify(modulePath);
      return `() => import(/* webpackChunkName: '${chunkName}' */ ${finalStr})`;
    };

    if (routes) {
      const componentStr = `Loadable({
    loader: ${genImportStr(componentPath, 'component')},
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
        addRoutesAsyncModule(routePath, modulePath);
        return `Mod${i}: ${genImportStr(modulePath, i, routePath)},`;
      })
      .join('\n');
    const modulesLoadedStr = modules
      .map((module, i) => `loaded.Mod${i}.default,`)
      .join('\n');

    let metadataImportStr = '';
    if (metadata) {
      const metadataPath = routesMetadataPath[routePath];
      addRoutesAsyncModule(routePath, metadataPath);
      metadataImportStr = `metadata: ${genImportStr(
        metadataPath,
        'metadata',
        routePath,
      )},`;
    }

    const componentStr = `Loadable.Map({
  loader: {
    ${modulesImportStr}
    ${metadataImportStr}
    Component: ${genImportStr(componentPath, 'component')},
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
    routesAsyncModules,
    routesConfig,
    routesMetadata,
    routesMetadataPath,
    routesPaths,
  };
}

module.exports = loadRoutes;
