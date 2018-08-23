async function genRoutesConfig({docsData = [], pagesData = []}) {
  function genDocsRoute({path: docsPath, source}) {
    return `
  {
    path: ${JSON.stringify(docsPath)},
    exact: true,
    component: Loadable({
      loader: () => import('@docs/${source}'),
      loading: Loading,
      render(loaded, props) {
        let Content = loaded.default;
        return <Docs {...props}><Content /></Docs>;
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

  return (
    `import React from 'react';\n` +
    `import Loading from '@theme/Loading';\n` +
    `import Loadable from 'react-loadable';\n` +
    `import Docs from '@theme/Docs';\n` +
    `import NotFound from '@theme/NotFound';\n` +
    `const routes = [${docsData.map(genDocsRoute).join(',')},${pagesData
      .map(genPagesRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
