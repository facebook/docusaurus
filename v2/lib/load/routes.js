async function genRoutesConfig({docsMetadatas = {}, pagesMetadatas = []}) {
  function gendocsUrl(metadata) {
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

  const docsUrls = Object.values(docsMetadatas)
    .map(gendocsUrl)
    .join(',');

  return (
    `import React from 'react';\n` +
    `import Loadable from 'react-loadable';\n` +
    `import Loading from '@theme/Loading';\n` +
    `import Docs from '@theme/Docs';\n` +
    `import Pages from '@theme/Pages';\n` +
    `import NotFound from '@theme/NotFound';\n` +
    `const routes = [${docsUrls},${pagesMetadatas
      .map(genPagesRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
