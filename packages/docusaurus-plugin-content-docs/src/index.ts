/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  Sidebars,
  Order,
  DocsMetadata,
  LoadedContent,
  SourceToPermalink,
  PermalinkToSidebar,
  SidebarItemLink,
  SidebarItemDoc,
  DocsSidebar,
  VersionMetadataProp,
  DocMetadataRaw,
  DocsMetadataRaw,
  DocMetadata,
  VersionToSidebars,
  SidebarItem,
  DocsSidebarItem,
  GlobalPluginData,
  VersionName,
  GlobalVersion,
  GlobalDoc,
  VersionMetadata,
  DocNavLink,
  OrderMetadata,
  LoadedVersion,
} from './types';
import {Configuration} from 'webpack';
import {docsVersion} from './version';
import {CURRENT_VERSION_NAME, VERSIONS_JSON_FILE} from './constants';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';
import {flatten, keyBy} from 'lodash';

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent, typeof PluginOptionSchema> {
  const {siteDir, generatedFilesDir, baseUrl} = context;

  const versionsMetadata = readVersionsMetadata(siteDir, options);
  const versionNames = versionsMetadata.map((version) => version.versionName);

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
  const legacyVersioningEnv = loadEnv(siteDir, pluginId, {
    disableVersioning: options.disableVersioning,
  });
  const {latestVersion} = legacyVersioningEnv.versioning;

  // TODO refactor
  function getVersionPath(version: VersionName) {
    if (version === latestVersion) {
      return '';
    }
    if (version === CURRENT_VERSION_NAME) {
      return 'next';
    }
    return version;
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
      env: legacyVersioningEnv,
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

      async function processVersionDocs(
        versionMetadata: VersionMetadata,
      ): Promise<DocMetadataRaw[]> {
        const docsFiles = await globby(include, {
          cwd: versionMetadata.docsPath,
        });
        async function processVersionDoc(source: string) {
          return processDocsMetadata({
            source,
            versionMetadata,
          });
        }
        return Promise.all(docsFiles.map(processVersionDoc));
      }

      async function loadVersion(
        versionMetadata: VersionMetadata,
      ): Promise<LoadedVersion> {
        const docs: DocMetadataRaw[] = await processVersionDocs(
          versionMetadata,
        );
        const docsById: DocsMetadataRaw = keyBy(docs, (doc) => doc.id);

        const sidebars = loadSidebars([versionMetadata.sidebarPath]);
        const docsOrder: Order = createOrder(sidebars);

        // Add sidebar/next/previous to the docs
        function addNavData(doc: DocMetadataRaw): DocMetadata {
          const {next: nextID, previous: previousID, sidebar} =
            docsOrder[doc.id] ?? {};

          function toDocNavLink(navDocId: string): DocNavLink {
            const navDoc = docsById[navDocId];
            return {
              title: navDoc.title,
              permalink: navDoc.permalink,
            };
          }

          const previous = previousID ? toDocNavLink(previousID) : undefined;
          const next = nextID ? toDocNavLink(nextID) : undefined;

          return {
            ...doc,
            sidebar,
            previous,
            next,
          };
        }

        const loadedDocs = docs.map(addNavData);

        // sort to ensure consistent output for tests
        loadedDocs.sort((a, b) => a.id.localeCompare(b.id));

        return {
          metadata: versionMetadata,
          docs: docs.map(addNavData),
        };
      }

      // TODO, we should namespace docs by version!
      const allDocs = flatten(
        await Promise.all(versionsMetadata.map(processVersionDocs)),
      );

      const allDocsById: DocsMetadataRaw = keyBy(allDocs, (doc) => doc.id);

      const loadedSidebars: Sidebars = loadSidebars(
        versionsMetadata.map((version) => version.sidebarPath),
      );

      const order: Order = createOrder(loadedSidebars);
      function getDocOrder(docId: string): OrderMetadata {
        return order[docId] ?? {};
      }

      // Construct inter-metadata relationship in docsMetadata.
      const docsMetadata: DocsMetadata = {};
      const permalinkToSidebar: PermalinkToSidebar = {};
      const versionToSidebars: VersionToSidebars = {};

      function addSidebarData(doc: DocMetadataRaw): DocMetadata {
        const {next: nextID, previous: previousID, sidebar} =
          order[doc.id] ?? {};

        function toDocNavLink(navDocId: string): DocNavLink {
          const navDoc = allDocsById[navDocId];
          return {
            title: navDoc.title,
            permalink: navDoc.permalink,
          };
        }

        const previous = previousID ? toDocNavLink(previousID) : undefined;
        const next = nextID ? toDocNavLink(nextID) : undefined;

        return {
          ...doc,
          sidebar,
          previous,
          next,
        };
      }

      Object.keys(allDocsById).forEach((currentID) => {
        const {sidebar} = getDocOrder(currentID);

        docsMetadata[currentID] = addSidebarData(allDocsById[currentID]);

        // sourceToPermalink and permalinkToSidebar mapping.
        const {source, permalink, version} = allDocsById[currentID];
        sourceToPermalink[source] = permalink;
        if (sidebar) {
          permalinkToSidebar[permalink] = sidebar;
          if (!versionToSidebars[version]) {
            versionToSidebars[version] = new Set();
          }
          versionToSidebars[version].add(sidebar);
        }
      });

      const convertDocLink = (item: SidebarItemDoc): SidebarItemLink => {
        const docId = item.id;
        const docMetadata = allDocsById[docId];

        if (!docMetadata) {
          throw new Error(
            `Bad sidebars file. The document id '${docId}' was used in the sidebar, but no document with this id could be found.
Available document ids=
- ${Object.keys(allDocsById).sort().join('\n- ')}`,
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

      const loadedVersions = await Promise.all(
        versionsMetadata.map(loadVersion),
      );

      return {
        loadedVersions,
        docsDir,
        docsSidebars,
        permalinkToSidebar: objectWithKeySorted(permalinkToSidebar),
        versionToSidebars,
      };
    },

    async contentLoaded({content, actions}) {
      const {
        loadedVersions,
        docsSidebars,
        permalinkToSidebar,
        versionToSidebars,
      } = content;
      const {docLayoutComponent, docItemComponent, routeBasePath} = options;
      const {addRoute, createData, setGlobalData} = actions;

      const pluginInstanceGlobalData: GlobalPluginData = {
        path: normalizeUrl([baseUrl, options.routeBasePath]),
        latestVersionName: latestVersion,
        // Initialized empty, will be mutated
        versions: [],
      };

      setGlobalData<GlobalPluginData>(pluginInstanceGlobalData);

      const createVersionMetadataProp = (
        version: VersionName,
      ): VersionMetadataProp => {
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

      const createDocRoutes = async (
        metadataItems: DocMetadata[],
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
      const getVersionRoutePriority = (version: VersionName) =>
        version === latestVersion ? -1 : undefined;

      async function handleVersion(loadedVersion: LoadedVersion) {
        const {
          metadata: {versionName},
          docs,
        } = loadedVersion;

        const versionPath = normalizeUrl([
          baseUrl,
          routeBasePath,
          getVersionPath(versionName),
        ]);
        const versionMetadataProp = createVersionMetadataProp(versionName);

        const versionMetadataPropPath = await createData(
          `${docuHash(normalizeUrl([versionPath, ':route']))}.json`,
          JSON.stringify(versionMetadataProp, null, 2),
        );

        const docsRoutes = await createDocRoutes(docs);

        const versionMainDoc: DocMetadata =
          docs.find(
            (doc) =>
              doc.unversionedId === options.homePageId || doc.slug === '/',
          ) ?? docs[0];

        const toGlobalDataDoc = (doc: DocMetadata): GlobalDoc => ({
          id: doc.unversionedId,
          path: doc.permalink,
        });

        pluginInstanceGlobalData.versions.push({
          name: versionMetadataProp.version,
          path: versionPath,
          mainDocId: versionMainDoc.unversionedId,
          docs: docs
            .map(toGlobalDataDoc)
            // stable ordering, useful for tests
            .sort((a, b) => a.id.localeCompare(b.id)),
        });

        const priority = getVersionRoutePriority(versionName);

        addRoute({
          path: versionPath,
          exact: false, // allow matching /docs/* as well
          component: docLayoutComponent, // main docs component (DocPage)
          routes: docsRoutes, // subroute for each doc
          modules: {
            versionMetadata: aliasedSource(versionMetadataPropPath),
          },
          priority,
        });
      }

      await Promise.all(loadedVersions.map(handleVersion));

      pluginInstanceGlobalData.versions = sortBy(
        pluginInstanceGlobalData.versions,
        (versionMetadata: GlobalVersion) => {
          return versionNames.indexOf(versionMetadata.name!);
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

      // TODO instead of creating one mdx loader rule for all versions
      // it may be simpler to create one mdx loader per version
      // particularly to handle the markdown/linkify process
      // (docsDir/versionedDir are a bit annoying here...)
      function createMDXLoaderRule() {
        return {
          test: /(\.mdx?)$/,
          include: versionsMetadata.map((vmd) => vmd.docsPath),
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
                  return path.join(dataDir, `${docuHash(aliasedPath)}.json`);
                },
              },
            },
            {
              loader: path.resolve(__dirname, './markdown/index.js'),
              options: {
                siteDir,
                docsDir,
                sourceToPermalink,
                versionedDir: legacyVersioningEnv.versioning.docsDir,
              },
            },
          ].filter(Boolean),
        };
      }

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
          rules: [createMDXLoaderRule()],
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
