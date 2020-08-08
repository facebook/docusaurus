/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import groupBy from 'lodash.groupby';
import pick from 'lodash.pick';
import pickBy from 'lodash.pickby';
import sortBy from 'lodash.sortby';
import globby from 'globby';
import path from 'path';
import chalk from 'chalk';

import admonitions from 'remark-admonitions';
import {
  STATIC_DIR_NAME,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/core/lib/constants';
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
import loadEnv, {readVersionsMetadata} from './env';

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
  GlobalPluginData,
  DocsVersion,
  GlobalVersion,
  GlobalDoc,
  VersionMetadata,
} from './types';
import {Configuration} from 'webpack';
import {docsVersion} from './version';
import {CURRENT_VERSION_NAME, VERSIONS_JSON_FILE} from './constants';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';
import {flatten} from 'lodash';

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null, typeof PluginOptionSchema> {
  const {siteDir, generatedFilesDir, baseUrl} = context;

  const versionsMetadata = readVersionsMetadata(siteDir, options);
  console.log(versionsMetadata);

  const docsDir = path.resolve(siteDir, options.path);

  const sourceToPermalink: SourceToPermalink = {};
  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  const aliasedSource = (source: string) =>
    `~docs/${path.relative(pluginDataDirRoot, source)}`;

  // TODO remove soon!
  // Versioning.
  const env = loadEnv(siteDir, pluginId, {
    disableVersioning: options.disableVersioning,
  });
  const {versioning} = env;
  const {versions, docsDir: versionedDir} = versioning;

  // TODO refactor
  function getVersionPath(versionName: string) {
    if (versionName === versioning.latestVersion) {
      return '';
    }
    if (versionName === CURRENT_VERSION_NAME) {
      return 'next';
    }
    return versionName;
  }

  async function processDocsMetadata({
    source,
    versionMetadata,
  }: {
    source: string;
    versionMetadata: VersionMetadata;
  }) {
    return processMetadata({
      source,
      versionMetadata,
      context,
      options,
      env,
    });
  }

  return {
    name: 'docusaurus-plugin-content-docs',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },

    extendCli(cli) {
      const isDefaultPluginId = pluginId === DEFAULT_PLUGIN_ID;

      // Need to create one distinct command per plugin instance
      // otherwise 2 instances would try to execute the command!
      const command = isDefaultPluginId
        ? 'docs:version'
        : `docs:version:${pluginId}`;
      const commandDescription = isDefaultPluginId
        ? 'Tag a new docs version'
        : `Tag a new docs version (${pluginId})`;

      cli
        .command(command)
        .arguments('<version>')
        .description(commandDescription)
        .action((version) => {
          docsVersion(version, siteDir, pluginId, {
            path: options.path,
            sidebarPath: options.sidebarPath,
          });
        });
    },

    getClientModules() {
      const modules = [];
      if (options.admonitions) {
        modules.push(require.resolve('remark-admonitions/styles/infima.css'));
      }
      return modules;
    },

    getPathsToWatch() {
      function getVersionPathsToWatch(version: VersionMetadata): string[] {
        return [
          version.sidebarPath,
          ...options.include.map((pattern) => `${version.docsPath}/${pattern}`),
        ];
      }

      return flatten(versionsMetadata.map(getVersionPathsToWatch));
    },

    async loadContent() {
      const {include} = options;

      async function withDocFiles(version: VersionMetadata) {
        const docsFiles = await globby(include, {
          cwd: version.docsPath,
        });
        return {version, docsFiles};
      }

      async function processVersionDocs(
        versionMetadata: VersionMetadata,
      ): Promise<MetadataRaw[]> {
        const {docsFiles} = await withDocFiles(versionMetadata);
        return Promise.all(
          docsFiles.map(async (source) => {
            return processDocsMetadata({
              source,
              versionMetadata,
            });
          }),
        );
      }

      // TODO refactor side-effectful
      // Prepare metadata container.
      const docsMetadataRaw: DocsMetadataRaw = {};

      await Promise.all(
        versionsMetadata.map(async (version) => {
          const versionDocs = await processVersionDocs(version);

          // TODO legacy side-effect, refactor!
          versionDocs.forEach((versionDoc) => {
            docsMetadataRaw[versionDoc.id] = versionDoc;
          });
        }),
      );

      const loadedSidebars: Sidebar = loadSidebars(
        versionsMetadata.map((version) => version.sidebarPath),
      );
      const order: Order = createOrder(loadedSidebars);

      // Construct inter-metadata relationship in docsMetadata.
      const docsMetadata: DocsMetadata = {};
      const permalinkToSidebar: PermalinkToSidebar = {};
      const versionToSidebars: VersionToSidebars = {};

      function toDocNavLink(docId: string) {
        const doc = docsMetadataRaw[docId];
        if (!doc) {
          throw new Error(
            `no doc for id=${docId}
 All ids=
- ${Object.keys(docsMetadataRaw).join('\n- ')}`,
          );
        }
        return {
          title: doc.title,
          permalink: doc.permalink,
        };
      }

      Object.keys(docsMetadataRaw).forEach((currentID) => {
        const {next: nextID, previous: previousID, sidebar} =
          order[currentID] ?? {};

        const previous = previousID ? toDocNavLink(previousID) : undefined;
        const next = nextID ? toDocNavLink(nextID) : undefined;

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
      const {addRoute, createData, setGlobalData} = actions;

      const pluginInstanceGlobalData: GlobalPluginData = {
        path: normalizeUrl([baseUrl, options.routeBasePath]),
        latestVersionName: versioning.latestVersion,
        // Initialized empty, will be mutated
        versions: [],
      };

      setGlobalData<GlobalPluginData>(pluginInstanceGlobalData);

      const createDocsBaseMetadata = (
        version: DocsVersion,
      ): DocsBaseMetadata => {
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

      // We want latest version route to have lower priority
      // Otherwise `/docs/next/foo` would match
      // `/docs/:route` instead of `/docs/next/:route`.
      const getVersionRoutePriority = (version: DocsVersion) =>
        version === versioning.latestVersion ? -1 : undefined;

      // This is the base route of the document root (for a doc given version)
      // (/docs, /docs/next, /docs/1.0 etc...)
      // The component applies the layout and renders the appropriate doc
      const addVersionRoute = async (
        docsBasePath: string,
        docsBaseMetadata: DocsBaseMetadata,
        docs: Metadata[],
        priority?: number,
      ) => {
        const docsBaseMetadataPath = await createData(
          `${docuHash(normalizeUrl([docsBasePath, ':route']))}.json`,
          JSON.stringify(docsBaseMetadata, null, 2),
        );

        const docsRoutes = await genRoutes(docs);

        const mainDoc: Metadata =
          docs.find(
            (doc) =>
              doc.unversionedId === options.homePageId || doc.slug === '/',
          ) ?? docs[0];

        const toGlobalDataDoc = (doc: Metadata): GlobalDoc => ({
          id: doc.unversionedId,
          path: doc.permalink,
        });

        pluginInstanceGlobalData.versions.push({
          name: docsBaseMetadata.version,
          path: docsBasePath,
          mainDocId: mainDoc.unversionedId,
          docs: docs
            .map(toGlobalDataDoc)
            // stable ordering, useful for tests
            .sort((a, b) => a.id.localeCompare(b.id)),
        });

        addRoute({
          path: docsBasePath,
          exact: false, // allow matching /docs/* as well
          component: docLayoutComponent, // main docs component (DocPage)
          routes: docsRoutes, // subroute for each doc
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
          // sort to ensure consistent output for tests
          Object.values(content.docsMetadata).sort((a, b) =>
            a.id.localeCompare(b.id),
          ),
          'version',
        );

        await Promise.all(
          Object.keys(docsMetadataByVersion).map(async (version) => {
            const docsMetadata = docsMetadataByVersion[version];

            const docsBaseRoute = normalizeUrl([
              baseUrl,
              routeBasePath,
              getVersionPath(version),
            ]);
            const docsBaseMetadata = createDocsBaseMetadata(version);

            await addVersionRoute(
              docsBaseRoute,
              docsBaseMetadata,
              docsMetadata,
              getVersionRoutePriority(version),
            );
          }),
        );
      } else {
        const docsMetadata = Object.values(content.docsMetadata);
        const docsBaseMetadata = createDocsBaseMetadata(null);
        const docsBaseRoute = normalizeUrl([baseUrl, routeBasePath]);
        await addVersionRoute(docsBaseRoute, docsBaseMetadata, docsMetadata);
      }

      // ensure version ordering on the global data (latest first)
      pluginInstanceGlobalData.versions = sortBy(
        pluginInstanceGlobalData.versions,
        (versionMetadata: GlobalVersion) => {
          // TODO keep order of versions.json?
          const orderedVersionNames = [CURRENT_VERSION_NAME, ...versions];
          return orderedVersionNames.indexOf(versionMetadata.name!);
        },
      );
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
            '~docs': pluginDataDirRoot,
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
                    staticDir: path.join(siteDir, STATIC_DIR_NAME),
                    metadataPath: (mdxPath: string) => {
                      // Note that metadataPath must be the same/in-sync as
                      // the path from createData for each MDX.
                      const aliasedPath = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedPath)}.json`,
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
  // TODO remove homePageId before end of 2020
  // "slug: /" is better because the home doc can be different across versions
  if (options.homePageId) {
    console.log(
      chalk.red(
        `The docs plugin option homePageId=${options.homePageId} is deprecated. To make a doc the "home", prefer frontmatter: "slug: /"`,
      ),
    );
  }

  if (typeof options.excludeNextVersionDocs !== 'undefined') {
    console.log(
      chalk.red(
        `The docs plugin option excludeNextVersionDocs=${
          options.excludeNextVersionDocs
        } is deprecated. Use the includeCurrentVersion=${!options.excludeNextVersionDocs} option instead!"`,
      ),
    );
    options.includeCurrentVersion = !options.excludeNextVersionDocs;
  }

  // @ts-expect-error: TODO bad OptionValidationContext, need refactor
  const validatedOptions: PluginOptions = validate(PluginOptionSchema, options);

  if (options.admonitions) {
    validatedOptions.remarkPlugins = validatedOptions.remarkPlugins.concat([
      [admonitions, options.admonitions],
    ]);
  }

  // @ts-expect-error: TODO bad OptionValidationContext, need refactor
  return validatedOptions;
}
