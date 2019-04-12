/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const {genChunkName, genComponentName, docuHash} = require('@docusaurus/utils');
const {stringify} = require('querystring');

async function loadRoutes(pluginsRouteConfigs) {
  const componentImports = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
  ];
  const routesImports = [
    `import React from 'react';`,
    `import NotFound from '@theme/NotFound';`,
  ];
  const addRoutesImport = importStr => {
    routesImports.push(importStr);
  };
  // Routes paths. Example: ['/', '/docs', '/blog/2017/09/03/test']
  const routesPaths = [];
  const addRoutesPath = routePath => {
    routesPaths.push(routePath);
  };
  // Mapping of routePath -> generatedPath. Example: '/blog' -> '@generated/blog-c06'
  const routesHashPath = {};
  const addRoutesHashPath = routePath => {
    routesHashPath[routePath] = `@generated/${docuHash(routePath)}`;
  };
  const routesHashPathFileName = 'hashPath.json';
  // Mapping of routePath -> metadata. Example: '/blog' -> { isBlogPage: true, permalink: '/blog' }
  const routesMetadata = {};
  const addRoutesMetadata = (routePath, metadata) => {
    if (metadata) {
      routesMetadata[routePath] = metadata;
    }
  };
  const routesMetadataFileName = 'metadata.json';
  // Mapping of routePath -> async imported modules. Example: '/blog' -> ['@theme/BlogPage']
  const routesAsyncModules = {};
  const addRoutesAsyncModule = (routePath, module) => {
    if (!routesAsyncModules[routePath]) {
      routesAsyncModules[routePath] = [];
    }
    routesAsyncModules[routePath].push(module);
  };
  const routesAsyncModulesFileName = 'asyncModules.json';
  // Mapping of routePath -> generated component code. Example: '/blog' -> `export default () => .....`;
  const routesComponentStr = {};
  const addRoutesComponentStr = (routePath, componentStr) => {
    routesComponentStr[routePath] = componentStr;
  };
  const routesComponentFileName = 'component.js';

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
    addRoutesHashPath(routePath);
    const hashPath = routesHashPath[routePath];
    addRoutesMetadata(routePath, metadata);

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

    const componentName = genComponentName(routePath);
    const importStr = `import ${componentName} from '${hashPath}/${routesComponentFileName}'`;
    addRoutesImport(importStr);

    if (routes) {
      const componentStr = `
${componentImports.join('\n')}
export default Loadable({
  loader: ${genImportStr(componentPath, 'component')},
  loading: Loading,
});
`;
      addRoutesComponentStr(routePath, componentStr);

      return `
{
  path: '${routePath}',
  component: ${componentName},
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
      const metadataPath = path.join(hashPath, routesMetadataFileName);
      addRoutesAsyncModule(routePath, metadataPath);
      metadataImportStr = `metadata: ${genImportStr(
        metadataPath,
        'metadata',
        routePath,
      )},`;
    }

    const componentStr = `
${componentImports.join('\n')}
export default Loadable.Map({
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
});\n`;
    addRoutesComponentStr(routePath, componentStr);

    return `
    {
      path: '${routePath}',
      exact: true,
      component: ${componentName}
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
    routesConfig,
    routesPaths,
    routesHashPath,
    routesHashPathFileName,
    routesMetadata,
    routesMetadataFileName,
    routesComponentStr,
    routesComponentFileName,
    routesAsyncModules,
    routesAsyncModulesFileName,
  };
}

module.exports = loadRoutes;
