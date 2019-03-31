/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {generateChunkName} = require('@docusaurus/utils');

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

  function generateRouteCode(pluginRouteConfig) {
    const {path, component, metadata, modules, routes} = pluginRouteConfig;
    if (routes) {
      return `
{
  path: '${path}',
  component: Loadable({
    loader: () => import(/* webpackChunkName: '${generateChunkName(
      component,
      'component',
    )}' */'${component}'),
    loading: Loading,
  }),
  routes: [${routes.map(generateRouteCode).join(',')}],
}`;
    }

    addRoutesPath(path);
    return `
{
  path: '${path}',
  exact: true,
  component: Loadable.Map({
    loader: {
${modules
  .map(
    (module, index) =>
      `      Module${index}: () => import(/* webpackChunkName: '${generateChunkName(
        path,
        `module${index}`,
      )}' */'${module}'),`,
  )
  .join('\n')}
      Component: () => import(/* webpackChunkName: '${generateChunkName(
        component,
        'component',
      )}' */'${component}'),
    },
    loading: Loading,
    render(loaded, props) {
      const Component = loaded.Component.default;
      const modules = [
${modules
  .map((module, index) => `        loaded.Module${index}.default,`)
  .join('\n')}
      ];
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
