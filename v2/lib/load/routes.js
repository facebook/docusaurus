/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {normalizeUrl} = require('./utils');

async function genRoutesConfig({
  siteConfig = {},
  docsMetadatas = {},
  pagesMetadatas = [],
  contentsStore = {},
  pluginRouteConfigs = [],
}) {
  const modules = [
    `import React from 'react';`,
    `import Loadable from 'react-loadable';`,
    `import Loading from '@theme/Loading';`,
    `import Doc from '@theme/Doc';`,
    `import DocBody from '@theme/DocBody';`,
    `import BlogPage from '@theme/BlogPage';`,
    `import Pages from '@theme/Pages';`,
    `import NotFound from '@theme/NotFound';`,
  ];

  // Docs.
  const {docsUrl, baseUrl} = siteConfig;
  function genDocsRoute(metadata) {
    const {permalink, source} = metadata;
    return `
{
  path: '${permalink}',
  exact: true,
  component: Loadable({
    loader: () => import(/* webpackPrefetch: true */ '${source}'),
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

  // Pages.
  function genPagesRoute(metadata) {
    const {permalink, source} = metadata;
    return `
{
  path: '${permalink}',
  exact: true,
  component: Loadable({
    loader: () => import(/* webpackPrefetch: true */ '${source}'),
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

  // Blog.
  function genBlogPageRoute(metadata) {
    const {permalink} = metadata;
    const {posts} = metadata;
    return `
{
  path: '${permalink}',
  exact: true,
  component: Loadable.Map({
    loader: {
      ${posts
        .map(
          (post, index) =>
            `post${index}: () => import(/* webpackPrefetch: true */ '${
              post.source
            }')`,
        )
        .join(',\n\t\t\t\t')}
    },
    loading: Loading,
    render(loaded, props) {
      ${posts
        .map((p, i) => `const Post${i} = loaded.post${i}.default;`)
        .join('\n\t\t\t\t')}
      return (
        <BlogPage {...props} metadata={${JSON.stringify(metadata)}} >
          ${posts.map((p, i) => `<Post${i} />`).join(' ')}
        </BlogPage>
      )
    }
  })
}`;
  }

  const notFoundRoute = `
{
  path: '*',
  component: NotFound,
}`;

  const routes = pluginRouteConfigs.map(pluginRouteConfig => {
    const {path, component, metadata, content} = pluginRouteConfig;
    return `
{
  path: '${path}',
  exact: true,
  component: Loadable.Map({
    loader: {
      Content: () => import('${content}'),
      Component: () => import('${component}'),
    },
    loading: Loading,
    render(loaded, props) {
      const Content = loaded.Content.default;
      const Component = loaded.Component.default;
      return (
        <Component {...props} metadata={${JSON.stringify(metadata)}}>
          <Content />
        </Component>
      )
    }
  })
}`;
  });

  return `
${modules.join('\n')}

const routes = [
// Docs.${pagesMetadatas.map(genPagesRoute).join(',')},

// Pages.${docsRoutes},

// Blog.${
    contentsStore.blog
      ? contentsStore.blog.contents
          .filter(metadata => metadata.isBlogPage)
          .map(genBlogPageRoute)
          .join(',')
      : ''
  },

// Plugins.${routes.join(',')},

// Not Found.${notFoundRoute},
];

export default routes;\n`;
}

module.exports = genRoutesConfig;
