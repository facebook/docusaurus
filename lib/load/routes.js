const path = require('path');
const {fileToComponentName} = require('./utils');

async function genRoutesConfig({docsData, docsDir}) {
  function genDocsRoute({path: docsPath, source}) {
    const componentName = fileToComponentName(source);
    return `
  {
    path: ${JSON.stringify(docsPath)},
    component: () => <Docs><${componentName} /></Docs>
  }`;
  }

  function genDocsImport({source}) {
    const filePath = path.resolve(docsDir, source);
    const componentName = fileToComponentName(source);
    return `import ${componentName} from ${JSON.stringify(filePath)}`;
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
    `${docsData.map(genDocsImport).join('\n')}\n` +
    `const routes = [${docsData
      .map(genDocsRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
