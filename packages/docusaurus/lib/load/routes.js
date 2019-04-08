/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {generateChunkName} = require('@docusaurus/utils');
const {stringify} = require('querystring');

async function loadRoutes(pluginsRouteConfigs) {
  const imports = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
    `import NotFound from '@theme/NotFound';`,
  ];

  const routesPaths = [];
  const addRoutesPath = permalink => {
    if (permalink && !/:|\*/.test(permalink)) {
      routesPaths.push(permalink);
    }
  };

  const notFoundRoute = `
{
  path: '*',
  component: NotFound,
}`;

  function genImportStr(target, prefix, name) {
    const isObj = typeof target === 'object';
    const importStr = isObj ? target.path : target;
    const queryStr = target.query ? `?${stringify(target.query)}` : '';
    const chunkName = generateChunkName(name || importStr, prefix);
    return `() => import(/* webpackChunkName: '${chunkName}' */ '${importStr}${queryStr}')`;
  }

  function generateRouteCode(pluginRouteConfig) {
    const {path, component, metadata, modules, routes} = pluginRouteConfig;
    if (routes) {
      return `
{
  path: '${path}',
  component: Loadable({
    loader: ${genImportStr(component, 'component')},
    loading: Loading,
  }),
  routes: [${routes.map(generateRouteCode).join(',')}],
}`;
    }

    addRoutesPath(path);
    const genModulesImportStr = `${modules
      .map((mod, i) => `Mod${i}: ${genImportStr(mod, i, path)},`)
      .join('\n')}`;
    const genModulesLoadedStr = `[${modules
      .map((mod, i) => `loaded.Mod${i}.default,`)
      .join('\n')}]`;

    return `
{
  path: '${path}',
  exact: true,
  component: Loadable.Map({
    loader: {
      ${genModulesImportStr}
      Component: ${genImportStr(component, 'component')},
    },
    loading: Loading,
    render(loaded, props) {
      const Component = loaded.Component.default;
      const modules = ${genModulesLoadedStr};
      return (
        <Component {...props} metadata={${JSON.stringify(
          metadata,
        )}} modules={modules}/>
      );
    }
  })
}`;
  }

  const routes = pluginsRouteConfigs.map(generateRouteCode);

  const routesConfig = `
${imports.join('\n')}

const routes = [
// Plugins.${routes.join(',')},

// Not Found.${notFoundRoute},
];

export default routes;\n`;

  return {routesConfig, routesPaths};
}

module.exports = loadRoutes;
