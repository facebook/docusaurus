const {idx} = require('./utils');

async function genRoutesConfig({
  docsData = {},
  pagesData = [],
  env,
  siteConfig
}) {
  function genDocsRoute(metadata) {
    const {permalink, source, version, language} = metadata;
    const defaultLanguage = idx(env, ['translation', 'defaultLanguage']);
    let importPath = `@docs/${source}`;
    if (language && language !== defaultLanguage.tag) {
      importPath = `@translated_docs/${source}`;
    } else if (version && version !== 'next') {
      importPath = `@versioned_docs/${source}`;
    }

    const {baseUrl} = siteConfig;
    const docsPath = `${baseUrl}${permalink}`;

    return `
  {
    path: ${JSON.stringify(docsPath)},
    exact: true,
    component: Loadable({
      loader: () => import(${JSON.stringify(importPath)}),
      loading: Loading,
      render(loaded, props) {
        let Content = loaded.default;
        return (
          <Docs {...props} metadata={${JSON.stringify(metadata)}}>
            <Content />
          </Docs>
        );
      }
    })
  }`;
  }

  function genPagesRoute({path: pagesPath, source}) {
    return `
  {
    path: ${JSON.stringify(pagesPath)},
    exact: true,
    component: Loadable({
      loader: () => import('@pages/${source}'),
      loading: Loading
    })
  }`;
  }

  const notFoundRoute = `,
  {
    path: '*',
    component: NotFound
  }`;

  const docsRoutes = Object.values(docsData)
    .map(genDocsRoute)
    .join(',');

  return (
    `import React from 'react';\n` +
    `import Loadable from 'react-loadable';\n` +
    `import Loading from '@theme/Loading';\n` +
    `import Docs from '@theme/Docs';\n` +
    `import NotFound from '@theme/NotFound';\n` +
    `const routes = [${docsRoutes},${pagesData
      .map(genPagesRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
