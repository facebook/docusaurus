/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import groupBy from 'lodash.groupby';
import pick from 'lodash.pick';
import pickBy from 'lodash.pickby';
import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import admonitions from 'remark-admonitions';
import {
  normalizeUrl,
  docuHash,
  objectWithKeySorted,
  aliasedSitePath,
} from '@docusaurus/utils';
import {
  LoadContext,
  Plugin,
  RouteConfig,
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';

import createOrder from './order';
import loadSidebars from './sidebars';
import processMetadata from './metadata';
import loadEnv from './env';

import {
  PluginOptions,
  Sidebar,
  Order,
  DocsMetadata,
  LoadedContent,
  SourceToPermalink,
  PermalinkToSidebar,
  SidebarItemLink,
  SidebarItemDoc,
  DocsSidebar,
  DocsBaseMetadata,
  MetadataRaw,
  DocsMetadataRaw,
  Metadata,
  VersionToSidebars,
  SidebarItem,
  DocsSidebarItem,
} from './types';
import {Configuration} from 'webpack';
import {docsVersion} from './version';
import {VERSIONS_JSON_FILE} from './constants';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';

function getFirstDocLinkOfSidebar(
  sidebarItems: DocsSidebarItem[],
): string | null {
  for (const sidebarItem of sidebarItems) {
    if (sidebarItem.type === 'category') {
      const url = getFirstDocLinkOfSidebar(sidebarItem.items);
      if (url) {
        return url;
      }
    } else {
      return sidebarItem.href;
    }
  }
  return null;
}

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null, typeof PluginOptionSchema> {
  const homePageDocsRoutePath =
    options.routeBasePath === '' ? '/' : options.routeBasePath;

  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, options.admonitions],
    ]);
  }

  const {siteDir, generatedFilesDir, baseUrl} = context;
  const docsDir = path.resolve(siteDir, options.path);
  const sourceToPermalink: SourceToPermalink = {};

  const dataDir = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );

  // Versioning.
  const env = loadEnv(siteDir);
  const {versioning} = env;
  const {
    versions,
    docsDir: versionedDir,
    sidebarsDir: versionedSidebarsDir,
  } = versioning;
  const versionsNames = versions.map((version) => `version-${version}`);

  return {
    name: 'docusaurus-plugin-content-docs',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    extendCli(cli) {
      cli
        .command('docs:version')
        .arguments('<version>')
        .description('Tag a new version for docs')
        .action((version) => {
          docsVersion(version, siteDir, {
            path: options.path,
            sidebarPath: options.sidebarPath,
          });
        });
    },

    getPathsToWatch() {
      const {include} = options;
      let globPattern = include.map((pattern) => `${docsDir}/${pattern}`);
      if (versioning.enabled) {
        const docsGlob = include
          .map((pattern) =>
            versionsNames.map(
              (versionName) => `${versionedDir}/${versionName}/${pattern}`,
            ),
          )
          .reduce((a, b) => a.concat(b), []);
        const sidebarsGlob = versionsNames.map(
          (versionName) =>
            `${versionedSidebarsDir}/${versionName}-sidebars.json`,
        );
        globPattern = [...globPattern, ...sidebarsGlob, ...docsGlob];
      }
      return [...globPattern, options.sidebarPath];
    },

    getClientModules() {
      const modules = [];

      if (options.admonitions) {
        modules.push(require.resolve('remark-admonitions/styles/infima.css'));
      }

      return modules;
    },

    // Fetches blog contents and returns metadata for the contents.
    async loadContent() {
      const {include, sidebarPath} = options;

      if (!fs.existsSync(docsDir)) {
        return null;
      }

      // Prepare metadata container.
      const docsMetadataRaw: DocsMetadataRaw = {};
      const docsPromises = [];
      const includeDefaultDocs = !(
        options.excludeNextVersionDocs && process.argv[2] === 'build'
      );

      // Metadata for default/master docs files.
      if (includeDefaultDocs) {
        const docsFiles = await globby(include, {
          cwd: docsDir,
        });
        docsPromises.push(
          Promise.all(
            docsFiles.map(async (source) => {
              const metadata: MetadataRaw = await processMetadata({
                source,
                refDir: docsDir,
                context,
                options,
                env,
              });
              docsMetadataRaw[metadata.id] = metadata;
            }),
          ),
        );
      }

      // Metadata for versioned docs.
      if (versioning.enabled) {
        const versionedGlob = include
          .map((pattern) =>
            versionsNames.map((versionName) => `${versionName}/${pattern}`),
          )
          .reduce((a, b) => a.concat(b), []);
        const versionedFiles = await globby(versionedGlob, {
          cwd: versionedDir,
        });
        docsPromises.push(
          Promise.all(
            versionedFiles.map(async (source) => {
              const metadata = await processMetadata({
                source,
                refDir: versionedDir,
                context,
                options,
                env,
              });
              docsMetadataRaw[metadata.id] = metadata;
            }),
          ),
        );
      }

      // Load the sidebars and create docs ordering.
      const sidebarPaths = versionsNames.map(
        (versionName) => `${versionedSidebarsDir}/${versionName}-sidebars.json`,
      );

      if (includeDefaultDocs) {
        sidebarPaths.unshift(sidebarPath);
      }

      const loadedSidebars: Sidebar = loadSidebars(sidebarPaths);
      const order: Order = createOrder(loadedSidebars);

      await Promise.all(docsPromises);

      // Construct inter-metadata relationship in docsMetadata.
      const docsMetadata: DocsMetadata = {};
      const permalinkToSidebar: PermalinkToSidebar = {};
      const versionToSidebars: VersionToSidebars = {};
      Object.keys(docsMetadataRaw).forEach((currentID) => {
        const {next: nextID, previous: previousID, sidebar} =
          order[currentID] || {};
        const previous = previousID
          ? {
              title: docsMetadataRaw[previousID]?.title ?? 'Previous',
              permalink: docsMetadataRaw[previousID]?.permalink,
            }
          : undefined;
        const next = nextID
          ? {
              title: docsMetadataRaw[nextID]?.title ?? 'Next',
              permalink: docsMetadataRaw[nextID]?.permalink,
            }
          : undefined;
        docsMetadata[currentID] = {
          ...docsMetadataRaw[currentID],
          sidebar,
          previous,
          next,
        };

        // sourceToPermalink and permalinkToSidebar mapping.
        const {source, permalink, version} = docsMetadataRaw[currentID];
        sourceToPermalink[source] = permalink;
        if (sidebar) {
          permalinkToSidebar[permalink] = sidebar;
          if (versioning.enabled && version) {
            if (!versionToSidebars[version]) {
              versionToSidebars[version] = new Set();
            }
            versionToSidebars[version].add(sidebar);
          }
        }
      });

      const convertDocLink = (item: SidebarItemDoc): SidebarItemLink => {
        const docId = item.id;
        const docMetadata = docsMetadataRaw[docId];

        if (!docMetadata) {
          throw new Error(
            `Bad sidebars file. The document id '${docId}' was used in the sidebar, but no document with this id could be found.
Available document ids=
- ${Object.keys(docsMetadataRaw).sort().join('\n- ')}`,
          );
        }

        const {title, permalink, sidebar_label} = docMetadata;

        return {
          type: 'link',
          label: sidebar_label || title,
          href: permalink,
        };
      };

      const normalizeItem = (item: SidebarItem): DocsSidebarItem => {
        switch (item.type) {
          case 'category':
            return {...item, items: item.items.map(normalizeItem)};
          case 'ref':
          case 'doc':
            return convertDocLink(item);
          case 'link':
          default:
            return item;
        }
      };

      // Transform the sidebar so that all sidebar item will be in the
      // form of 'link' or 'category' only.
      // This is what will be passed as props to the UI component.
      const docsSidebars: DocsSidebar = Object.entries(loadedSidebars).reduce(
        (acc: DocsSidebar, [sidebarId, sidebarItems]) => {
          acc[sidebarId] = sidebarItems.map(normalizeItem);
          return acc;
        },
        {},
      );
      return {
        docsMetadata,
        docsDir,
        docsSidebars,
        permalinkToSidebar: objectWithKeySorted(permalinkToSidebar),
        versionToSidebars,
      };
    },

    async contentLoaded({content, actions}) {
      if (!content || Object.keys(content.docsMetadata).length === 0) {
        return;
      }

      const {docLayoutComponent, docItemComponent, routeBasePath} = options;
      const {addRoute, createData} = actions;
      const aliasedSource = (source: string) =>
        `~docs/${path.relative(dataDir, source)}`;

      const createDocsBaseMetadata = (version?: string): DocsBaseMetadata => {
        const {docsSidebars, permalinkToSidebar, versionToSidebars} = content;
        const neededSidebars: Set<string> =
          versionToSidebars[version!] || new Set();

        return {
          docsSidebars: version
            ? pick(docsSidebars, Array.from(neededSidebars))
            : docsSidebars,
          permalinkToSidebar: version
            ? pickBy(permalinkToSidebar, (sidebar) =>
                neededSidebars.has(sidebar),
              )
            : permalinkToSidebar,
          version,
        };
      };

      const genRoutes = async (
        metadataItems: Metadata[],
      ): Promise<RouteConfig[]> => {
        const routes = await Promise.all(
          metadataItems.map(async (metadataItem) => {
            await createData(
              // Note that this created data path must be in sync with
              // metadataPath provided to mdx-loader.
              `${docuHash(metadataItem.source)}.json`,
              JSON.stringify(metadataItem, null, 2),
            );

            return {
              path: metadataItem.permalink,
              component: docItemComponent,
              exact: true,
              modules: {
                content: metadataItem.source,
              },
            };
          }),
        );

        return routes.sort((a, b) => a.path.localeCompare(b.path));
      };

      // This is the base route of the document root (for a doc given version)
      // (/docs, /docs/next, /docs/1.0 etc...)
      // The component applies the layout and renders the appropriate doc
      const addBaseRoute = async (
        docsBasePath: string,
        docsBaseMetadata: DocsBaseMetadata,
        routes: RouteConfig[],
        priority?: number,
      ) => {
        const docsBaseMetadataPath = await createData(
          `${docuHash(normalizeUrl([docsBasePath, ':route']))}.json`,
          JSON.stringify(docsBaseMetadata, null, 2),
        );

        addRoute({
          path: docsBasePath,
          exact: false, // allow matching /docs/* as well
          component: docLayoutComponent, // main docs component (DocPage)
          routes, // subroute for each doc
          modules: {
            docsMetadata: aliasedSource(docsBaseMetadataPath),
          },
          priority,
        });
      };

      // If versioning is enabled, we cleverly chunk the generated routes
      // to be by version and pick only needed base metadata.
      if (versioning.enabled) {
        const docsMetadataByVersion = groupBy(
          Object.values(content.docsMetadata),
          'version',
        );
        const rootUrl =
          options.homePageId && content.docsMetadata[options.homePageId]
            ? normalizeUrl([baseUrl, routeBasePath])
            : getFirstDocLinkOfSidebar(
                content.docsSidebars[
                  `version-${versioning.latestVersion}/docs`
                ],
              );
        if (!rootUrl) {
          throw new Error('Bad sidebars file. No document linked');
        }
        Object.values(content.docsMetadata).forEach((docMetadata) => {
          if (docMetadata.version !== versioning.latestVersion) {
            docMetadata.latestVersionMainDocPermalink = rootUrl;
          }
        });
        await Promise.all(
          Object.keys(docsMetadataByVersion).map(async (version) => {
            const routes: RouteConfig[] = await genRoutes(
              docsMetadataByVersion[version],
            );

            const isLatestVersion = version === versioning.latestVersion;
            const docsBaseRoute = normalizeUrl([
              baseUrl,
              routeBasePath,
              isLatestVersion ? '' : version,
            ]);
            const docsBaseMetadata = createDocsBaseMetadata(version);

            return addBaseRoute(
              docsBaseRoute,
              docsBaseMetadata,
              routes,
              // We want latest version route config to be placed last in the
              // generated routeconfig. Otherwise, `/docs/next/foo` will match
              // `/docs/:route` instead of `/docs/next/:route`.
              isLatestVersion ? -1 : undefined,
            );
          }),
        );
      } else {
        const routes = await genRoutes(Object.values(content.docsMetadata));
        const docsBaseMetadata = createDocsBaseMetadata();
        const docsBaseRoute = normalizeUrl([baseUrl, routeBasePath]);
        await addBaseRoute(docsBaseRoute, docsBaseMetadata, routes);
      }
    },

    async routesLoaded(routes) {
      const homeDocsRoutes = routes.filter(
        (routeConfig) => routeConfig.path === homePageDocsRoutePath,
      );

      // Remove the route for docs home page if there is a page with the same path (i.e. docs).
      if (homeDocsRoutes.length > 1) {
        const docsHomePageRouteIndex = routes.findIndex(
          (route) =>
            route.component === options.docLayoutComponent &&
            route.path === homePageDocsRoutePath,
        );

        delete routes[docsHomePageRouteIndex!];
      }
    },

    configureWebpack(_config, isServer, utils) {
      const {getBabelLoader, getCacheLoader} = utils;
      const {rehypePlugins, remarkPlugins} = options;
      // Suppress warnings about non-existing of versions file.
      const stats = {
        warningsFilter: [VERSIONS_JSON_FILE],
      };

      return {
        stats,
        devServer: {
          stats,
        },
        resolve: {
          alias: {
            '~docs': dataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [docsDir, versionedDir].filter(Boolean),
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    metadataPath: (mdxPath: string) => {
                      // Note that metadataPath must be the same/in-sync as
                      // the path from createData for each MDX.
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdown/index.js'),
                  options: {
                    siteDir,
                    docsDir,
                    sourceToPermalink,
                    versionedDir,
                  },
                },
              ].filter(Boolean),
            },
          ],
        },
      } as Configuration;
    },
  };
}

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, ValidationError>): ValidationResult<
  PluginOptions,
  ValidationError
> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
