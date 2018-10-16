async function genRoutesConfig({docsMetadatas = {}, pagesMetadatas = []}) {
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
          <Doc {...props} metadata={${JSON.stringify(metadata)}}>
            <Content />
          </Doc>
        );
      }
    })
  }`;
  }

  function genPagesRoute(metadata) {
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
          <Pages {...props} metadata={${JSON.stringify(metadata)}}>
            <Content {...props} metadata={${JSON.stringify(metadata)}} />
          </Pages>
        );
      }
    })
  }`;
  }

  const notFoundRoute = `,
  {
    path: '*',
    component: NotFound
  }`;

  const docsRoutes = Object.values(docsMetadatas)
    .map(genDocsRoute)
    .join(',');

  return (
    `import React from 'react';\n` +
    `import Loadable from 'react-loadable';\n` +
    `import Loading from '@theme/Loading';\n` +
    `import Doc from '@theme/Doc';\n` +
    `import Pages from '@theme/Pages';\n` +
    `import NotFound from '@theme/NotFound';\n` +
    `const routes = [${docsRoutes},${pagesMetadatas
      .map(genPagesRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
