/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

async function genRoutesConfig({
  docsMetadatas = {},
  pagesMetadatas = [],
  blogMetadatas = [],
}) {
  function genDocsRoute(metadata) {
    const {permalink, source} = metadata;
    return `
  {
    path: ${JSON.stringify(permalink)},
    exact: true,
    component: Loadable.Map({
      loader: {
        MarkdownContent: () => import(${JSON.stringify(source)}),
        Doc: () => import('@theme/Doc')
      },
      loading: Loading,
      render(loaded, props) {
        const MarkdownContent = loaded.MarkdownContent.default;
        const Doc = loaded.Doc.default;
        return (
          <Doc {...props} metadata={${JSON.stringify(metadata)}}>
            <MarkdownContent />
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
    component: Loadable.Map({
      loader: {
        PageContent: () => import(${JSON.stringify(source)}),
        Pages: () => import('@theme/Pages')
      },
      loading: Loading,
      render(loaded, props) {
        const Pages = loaded.Pages.default;
        const PageContent = loaded.PageContent.default;
        return (
          <Pages {...props} metadata={${JSON.stringify(metadata)}}>
            <PageContent {...props} metadata={${JSON.stringify(metadata)}} />
          </Pages>
        );
      }
    })
  }`;
  }

  function genBlogRoute(metadata) {
    const {permalink, source} = metadata;
    if (metadata.isBlogPage) {
      const {posts} = metadata;
      return `
  {
    path: ${JSON.stringify(permalink)},
    exact: true,
    component: Loadable.Map({
      loader: {
        BlogPage: () => import('@theme/BlogPage'),
        ${posts
          .map((p, i) => `post${i}: () => import(${JSON.stringify(p.source)})`)
          .join(',\n\t\t\t\t')}
      },
      loading: Loading,
      render(loaded, props) {
        const BlogPage = loaded.BlogPage.default;
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

    return `
  {
    path: ${JSON.stringify(permalink)},
    exact: true,
    component: Loadable.Map({
      loader: {
        MarkdownContent: () => import(${JSON.stringify(source)}),
        BlogPost: () => import('@theme/BlogPost')
      },
      loading: Loading,
      render(loaded, props) {
        const BlogPost = loaded.BlogPost.default;
        const MarkdownContent = loaded.MarkdownContent.default;
        return (
          <BlogPost {...props} metadata={${JSON.stringify(metadata)}}>
            <MarkdownContent />
          </BlogPost>
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
    `import NotFound from '@theme/NotFound';\n` +
    `const routes = [${docsRoutes},${pagesMetadatas
      .map(genPagesRoute)
      .join(',')},${blogMetadatas
      .map(genBlogRoute)
      .join(',')}${notFoundRoute}\n];\n` +
    `export default routes;\n`
  );
}

module.exports = genRoutesConfig;
