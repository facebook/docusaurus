const {fileToComponentName} = require('./utils');

async function genRoutesConfig({docsData, pagesData}) {
  function genDocsRoute({path: docsPath, source}) {
    const componentName = fileToComponentName(source);
    return `
  {
    path: ${JSON.stringify(docsPath)},
    exact: true,
    component: () => (
      <Docs>
        <${componentName} />
      </Docs>
    )
  }`;
  }

  function genDocsImport({source}) {
    const componentName = fileToComponentName(source);
    return `import ${componentName} from '@docs/${source}';`;
  }

  function genPagesRoute({path: pagesPath, source}) {
    const componentName = fileToComponentName(source);
    return `
  {
    path: ${JSON.stringify(pagesPath)},
    exact: true,
    component: ${componentName}
  }`;
  }

  function genPagesImport({source}) {
    const componentName = fileToComponentName(source);
    return `import ${componentName} from '@pages/${source}';`;
  }

  const notFoundRoute = `,
  {
    path: '*',
    component: NotFound
  }`;

  return (
    `import React from 'react';\n` +
    `import Docs from '@theme/Docs';\n` +
    `import NotFound from '@theme/NotFound';\n` +
    `${pagesData.map(genPagesImport).join('\n')}\n` +
    `${docsData.map(genDocsImport).join('\n')}\n` +
    `const routes = [${docsData.map(genDocsRoute).join(',')},${pagesData
      .map(genPagesRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
