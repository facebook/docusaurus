async function genRoutesConfig({docsData = {}, pagesData = []}) {
  function genDocsRoute(metadata) {
    const {permalink, source} = metadata;
    return `
  {
    path: ${JSON.stringify(permalink)},
    exact: true,
    component: Loadable({
      loader: () => import(${JSON.stringify(source)}),
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
