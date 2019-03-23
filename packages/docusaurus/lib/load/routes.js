/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {normalizeUrl} = require('@docusaurus/utils');

async function loadRoutes({
  siteConfig = {},
  docsMetadatas = {},
  pluginRouteConfigs = [],
}) {
  const imports = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
    `import Doc from '@theme/Doc';`,
    `import DocBody from '@theme/DocBody';`,
    `import NotFound from '@theme/NotFound';`,
  ];

  const routesPaths = [];
  const addRoutesPath = permalink => {
    if (permalink && !/:|\*/.test(permalink)) {
      routesPaths.push(permalink);
    }
  };

  // Docs.
  const {docsUrl, baseUrl} = siteConfig;
  function genDocsRoute(metadata) {
    const {permalink, source} = metadata;
    addRoutesPath(permalink);
    return `
{
  path: '${permalink}',
  exact: true,
  component: Loadable({
    loader: () => import('${source}'),
    loading: Loading,
    render(loaded, props) {
      let Content = loaded.default;
      return (
        <DocBody {...props} metadata={${JSON.stringify(metadata)}}>
          <Content />
        </DocBody>
      );
    }
  })
}`;
  }

  const rootDocsUrl = normalizeUrl([baseUrl, docsUrl]);
  const docsRoutes = `
{
  path: '${rootDocsUrl}',
  component: Doc,
  routes: [${Object.values(docsMetadatas)
    .map(genDocsRoute)
    .join(',')}],
}`;

  const notFoundRoute = `
{
  path: '*',
  component: NotFound,
}`;

  const routes = pluginRouteConfigs.map(pluginRouteConfig => {
    const {path, component, metadata, modules} = pluginRouteConfig;
    addRoutesPath(path);
    return `
{
  path: '${path}',
  exact: true,
  component: Loadable.Map({
    loader: {
${modules
  .map((module, index) => `      Module${index}: () => import('${module}'),`)
  .join('\n')}
      Component: () => import('${component}'),
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
  });

  const routesConfig = `
${imports.join('\n')}

const routes = [
// Docs.${docsRoutes},

// Plugins.${routes.join(',')},

// Not Found.${notFoundRoute},
];

export default routes;\n`;

  return {routesConfig, routesPaths};
}

module.exports = loadRoutes;
