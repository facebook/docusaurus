/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {Globby, DOCUSAURUS_VERSION} from '@docusaurus/utils';
import Color from 'color';

import extractMetadata, {shouldQuotifyFrontMatter} from './frontMatter';
import migratePage from './transform';
import sanitizeMD from './sanitizeMD';

import type {
  SidebarEntry,
  SidebarEntries,
  VersionOneConfig,
  VersionTwoConfig,
} from './types';

async function walk(dir: string): Promise<string[]> {
  const results: string[] = [];
  const list = await fs.readdir(dir);
  for (const file of list) {
    const fullPath = `${dir}/${file}`;
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      results.push(...(await walk(fullPath)));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function sanitizedFileContent(
  content: string,
  migrateMDFiles: boolean,
): string {
  const extractedData = extractMetadata(content);
  const extractedMetaData = Object.entries(extractedData.metadata)
    .map(
      ([key, value]) =>
        `${key}: ${
          shouldQuotifyFrontMatter([key, value]) ? `"${value}"` : value
        }`,
    )
    .join('\n');
  const sanitizedData = `---
${extractedMetaData}
---
${
  migrateMDFiles
    ? sanitizeMD(extractedData.rawContent)
    : extractedData.rawContent
}`;
  return sanitizedData;
}

type MigrationContext = {
  siteDir: string;
  newDir: string;
  deps: {[key: string]: string};
  shouldMigrateMdFiles: boolean;
  shouldMigratePages: boolean;
  v1Config: VersionOneConfig;
  v2Config: VersionTwoConfig;
};

export async function migrateDocusaurusProject(
  siteDir: string,
  newDir: string,
  shouldMigrateMdFiles: boolean = false,
  shouldMigratePages: boolean = false,
): Promise<void> {
  async function createMigrationContext(): Promise<MigrationContext> {
    const v1Config = (await import(`${siteDir}/siteConfig.js`))
      .default as VersionOneConfig;
    logger.info('Starting migration from v1 to v2...');
    const deps = {
      '@docusaurus/core': DOCUSAURUS_VERSION,
      '@docusaurus/preset-classic': DOCUSAURUS_VERSION,
      clsx: '^1.1.1',
      react: '^17.0.2',
      'react-dom': '^17.0.2',
    };
    const partialMigrationContext = {
      siteDir,
      newDir,
      deps,
      shouldMigrateMdFiles,
      shouldMigratePages,
      v1Config,
    };
    const v2Config = createConfigFile(partialMigrationContext);
    return {
      ...partialMigrationContext,
      v2Config,
    };
  }

  const migrationContext = await createMigrationContext();
  let errorCount = 0;
  try {
    createClientRedirects(migrationContext);
    logger.success('Created client redirect for non clean URL');
  } catch (err) {
    logger.error(`Failed to creating redirects: ${err}`);
    errorCount += 1;
  }
  if (shouldMigratePages) {
    try {
      await createPages(migrationContext);
      logger.success(
        'Created new doc pages (check migration page for more details)',
      );
    } catch (err) {
      logger.error(`Failed to create new doc pages: ${err}`);
      errorCount += 1;
    }
  } else {
    try {
      await createDefaultLandingPage(migrationContext);
      logger.success(
        'Created landing page (check migration page for more details)',
      );
    } catch (err) {
      logger.error(`Failed to create landing page: ${err}`);
      errorCount += 1;
    }
  }

  try {
    await migrateStaticFiles(migrationContext);
    logger.success('Migrated static folder');
  } catch (err) {
    logger.error(`Failed to copy static folder: ${err}`);
    errorCount += 1;
  }
  try {
    await migrateBlogFiles(migrationContext);
  } catch (err) {
    logger.error(`Failed to migrate blogs: ${err}`);
    errorCount += 1;
  }
  try {
    await handleVersioning(migrationContext);
  } catch (err) {
    logger.error(`Failed to migrate versioned docs: ${err}`);
    errorCount += 1;
  }

  try {
    await migrateLatestDocs(migrationContext);
  } catch (err) {
    logger.error(`Failed to migrate docs: ${err}`);
    errorCount += 1;
  }

  try {
    await migrateLatestSidebar(migrationContext);
  } catch (err) {
    logger.error(`Failed to migrate sidebar: ${err}`);
    errorCount += 1;
  }

  try {
    await fs.outputFile(
      path.join(newDir, 'docusaurus.config.js'),
      `module.exports=${JSON.stringify(migrationContext.v2Config, null, 2)}`,
    );
    logger.success(
      `Created a new config file with new navbar and footer config`,
    );
  } catch (err) {
    logger.error(`Failed to create config file: ${err}`);
    errorCount += 1;
  }
  try {
    await migratePackageFile(migrationContext);
  } catch (err) {
    logger.error(
      `Error occurred while creating package.json file for project: ${err}`,
    );
    errorCount += 1;
  }
  if (errorCount) {
    logger.warn`Migration from v1 to v2 failed with number=${errorCount} errors: please check the log above`;
  } else {
    logger.success('Completed migration from v1 to v2');
  }
}

export function createConfigFile({
  v1Config,
  siteDir,
  newDir,
}: Pick<
  MigrationContext,
  'v1Config' | 'siteDir' | 'newDir'
>): VersionTwoConfig {
  const siteConfig = v1Config;
  const customConfigFields: {[key: string]: unknown} = {};
  // Add fields that are unknown to v2 to customConfigFields
  Object.keys(siteConfig).forEach((key) => {
    const knownFields = [
      'title',
      'tagline',
      'url',
      'baseUrl',
      'organizationName',
      'projectName',
      'scripts',
      'stylesheets',
      'favicon',
      'cname',
      'noIndex',
      'headerLinks',
      'headerIcon',
      'footerIcon',
      'algolia',
      'colors',
      'copyright',
      'editUrl',
      'customDocsPath',
      'facebookComments',
      'usePrism',
      'highlight',
      'twitterUsername',
      'scrollToTopOptions',
      'twitter',
      'twitterImage',
      'onPageNav',
      'cleanUrl',
      'ogImage',
      'scrollToTop',
      'enableUpdateTime',
      'enableUpdateBy',
      'docsSideNavCollapsible',
      'gaTrackingId',
      'gaGtag',
    ];
    const value = siteConfig[key as keyof typeof siteConfig];
    if (value !== undefined && !knownFields.includes(key)) {
      customConfigFields[key] = value;
    }
  });
  logger.info`Following Fields from path=${'siteConfig.js'} will be added to path=${'docusaurus.config.js'} in code=${'customFields'}: ${Object.keys(
    customConfigFields,
  )}`;

  let v2DocsPath: string | undefined;
  if (siteConfig.customDocsPath) {
    const absoluteDocsPath = path.resolve(
      siteDir,
      '..',
      siteConfig.customDocsPath,
    );
    v2DocsPath = path.relative(newDir, absoluteDocsPath);
  }

  return {
    title: siteConfig.title ?? '',
    tagline: siteConfig.tagline,
    url: siteConfig.url ?? '',
    baseUrl: siteConfig.baseUrl ?? '',
    organizationName: siteConfig.organizationName,
    projectName: siteConfig.projectName,
    noIndex: siteConfig.noIndex,
    scripts: siteConfig.scripts,
    stylesheets: siteConfig.stylesheets,
    favicon: siteConfig.favicon ?? '',
    customFields: customConfigFields,
    onBrokenLinks: 'log',
    onBrokenMarkdownLinks: 'log',
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            ...(v2DocsPath && {path: v2DocsPath}),
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
            editUrl: siteConfig.editUrl,
          },
          blog: {},
          theme: {},
          ...(() => {
            if (siteConfig.gaTrackingId) {
              if (siteConfig.gaGtag) {
                return {gtag: {trackingID: siteConfig.gaTrackingId}};
              }
              return {googleAnalytics: {trackingID: siteConfig.gaTrackingId}};
            }
            return undefined;
          })(),
        },
      ],
    ],
    plugins: [],
    themeConfig: {
      navbar: {
        title: siteConfig.title,
        logo: siteConfig.headerIcon
          ? {
              src: siteConfig.headerIcon,
            }
          : undefined,
        items: (siteConfig.headerLinks ?? [])
          .map((link) => {
            const {doc, href, label, page} = link;
            const position = 'left';
            if (doc) {
              return {
                to: `docs/${doc}`,
                label,
                position,
              };
            }
            if (page) {
              return {
                to: `/${page}`,
                label,
                position,
              };
            }
            if (href) {
              return {href, label, position};
            }
            return null;
          })
          .filter(Boolean),
      },
      image: siteConfig.ogImage ? siteConfig.ogImage : undefined,
      footer: {
        links: siteConfig.twitterUsername
          ? [
              {
                title: 'Community',
                items: [
                  {
                    label: 'Twitter',
                    to: `https://twitter.com/${siteConfig.twitterUsername}`,
                  },
                ],
              },
            ]
          : [],
        copyright: siteConfig.copyright,
        logo: {
          src: siteConfig.footerIcon,
        },
      },
      algolia: siteConfig.algolia ? siteConfig.algolia : undefined,
    },
  };
}

function createClientRedirects(context: MigrationContext): void {
  if (!context.v1Config.cleanUrl) {
    context.deps['@docusaurus/plugin-client-redirects'] = DOCUSAURUS_VERSION;
    context.v2Config.plugins.push([
      '@docusaurus/plugin-client-redirects',
      {fromExtensions: ['html']},
    ]);
  }
}

async function createPages(context: MigrationContext) {
  const {newDir, siteDir} = context;
  await fs.mkdirp(path.join(newDir, 'src', 'pages'));
  if (await fs.pathExists(path.join(siteDir, 'pages', 'en'))) {
    try {
      await fs.copy(
        path.join(siteDir, 'pages', 'en'),
        path.join(newDir, 'src', 'pages'),
      );
      const files = await Globby('**/*.js', {
        cwd: path.join(newDir, 'src', 'pages'),
      });
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(newDir, 'src', 'pages', file);
          const content = await fs.readFile(filePath, 'utf-8');
          await fs.outputFile(filePath, migratePage(content));
        }),
      );
    } catch (err) {
      logger.error(`Unable to migrate Pages: ${err}`);
      await createDefaultLandingPage(context);
    }
  } else {
    logger.info('Ignoring Pages');
  }
}

async function createDefaultLandingPage({newDir}: MigrationContext) {
  const indexPage = `import Layout from "@theme/Layout";
      import React from "react";

      export default () => {
        return <Layout />;
      };
      `;
  await fs.outputFile(`${newDir}/src/pages/index.js`, indexPage);
}

async function migrateStaticFiles({siteDir, newDir}: MigrationContext) {
  if (await fs.pathExists(path.join(siteDir, 'static'))) {
    await fs.copy(path.join(siteDir, 'static'), path.join(newDir, 'static'));
  } else {
    await fs.mkdir(path.join(newDir, 'static'));
  }
}

async function migrateBlogFiles(context: MigrationContext) {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  if (await fs.pathExists(path.join(siteDir, 'blog'))) {
    await fs.copy(path.join(siteDir, 'blog'), path.join(newDir, 'blog'));
    const files = await walk(path.join(newDir, 'blog'));
    await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file, 'utf-8');
        await fs.outputFile(
          file,
          sanitizedFileContent(content, shouldMigrateMdFiles),
        );
      }),
    );
    context.v2Config.presets[0][1].blog.path = 'blog';
    logger.success('Migrated blogs to version 2 with change in front matter');
  } else {
    logger.warn('Blog not found. Skipping migration for blog');
  }
}

async function handleVersioning(context: MigrationContext) {
  const {siteDir, newDir} = context;
  if (await fs.pathExists(path.join(siteDir, 'versions.json'))) {
    const loadedVersions = (await fs.readJSON(
      path.join(siteDir, 'versions.json'),
    )) as string[];
    await fs.copyFile(
      path.join(siteDir, 'versions.json'),
      path.join(newDir, 'versions.json'),
    );
    const versions = loadedVersions.reverse();
    const versionRegex = new RegExp(`version-(${versions.join('|')})-`, 'gim');
    await migrateVersionedSidebar(context, versions, versionRegex);
    await fs.mkdirp(path.join(newDir, 'versioned_docs'));
    await migrateVersionedDocs(context, versions, versionRegex);
    logger.success`Migrated version docs and sidebar. The following doc versions have been created:name=${loadedVersions}`;
  } else {
    logger.warn(
      'Versioned docs not found. Skipping migration for versioned docs',
    );
  }
}

async function migrateVersionedDocs(
  context: MigrationContext,
  versions: string[],
  versionRegex: RegExp,
) {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  await Promise.all(
    versions.reverse().map(async (version, index) => {
      if (index === 0) {
        await fs.copy(
          path.join(siteDir, '..', context.v1Config.customDocsPath ?? 'docs'),
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
        await fs.copy(
          path.join(siteDir, 'versioned_docs', `version-${version}`),
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
        return;
      }
      try {
        await fs.mkdirs(
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
        await fs.copy(
          path.join(
            newDir,
            'versioned_docs',
            `version-${versions[index - 1]!}`,
          ),
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
        await fs.copy(
          path.join(siteDir, 'versioned_docs', `version-${version}`),
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
      } catch {
        await fs.copy(
          path.join(
            newDir,
            'versioned_docs',
            `version-${versions[index - 1]!}`,
          ),
          path.join(newDir, 'versioned_docs', `version-${version}`),
        );
      }
    }),
  );
  const files = await walk(path.join(newDir, 'versioned_docs'));
  await Promise.all(
    files.map(async (pathToFile) => {
      if (path.extname(pathToFile) === '.md') {
        const content = await fs.readFile(pathToFile, 'utf-8');
        await fs.outputFile(
          pathToFile,
          sanitizedFileContent(
            content.replace(versionRegex, ''),
            shouldMigrateMdFiles,
          ),
        );
      }
    }),
  );
}

async function migrateVersionedSidebar(
  context: MigrationContext,
  versions: string[],
  versionRegex: RegExp,
) {
  const {siteDir, newDir} = context;
  if (await fs.pathExists(path.join(siteDir, 'versioned_sidebars'))) {
    await fs.mkdirp(path.join(newDir, 'versioned_sidebars'));
    const sidebars: {
      entries: SidebarEntries;
      version: string;
    }[] = [];
    // Order matters: if a sidebar file doesn't exist, we have to use the
    // previous version's
    for (let i = 0; i < versions.length; i += 1) {
      const version = versions[i]!;
      let sidebarEntries: SidebarEntries;
      const sidebarPath = path.join(
        siteDir,
        'versioned_sidebars',
        `version-${version}-sidebars.json`,
      );
      try {
        sidebarEntries = (await fs.readJSON(sidebarPath)) as SidebarEntries;
      } catch {
        sidebars.push({version, entries: sidebars[i - 1]!.entries});
        return;
      }
      const newSidebar = Object.entries(sidebarEntries).reduce(
        (topLevel: SidebarEntries, value) => {
          const key = value[0].replace(versionRegex, '');
          topLevel[key] = Object.entries(value[1]).reduce<{
            [key: string]: (string | {[key: string]: unknown})[];
          }>((acc, val) => {
            acc[val[0].replace(versionRegex, '')] = (
              val[1] as SidebarEntry[]
            ).map((item) => {
              if (typeof item === 'string') {
                return item.replace(versionRegex, '');
              }
              return {
                type: 'category',
                label: item.label,
                ids: item.ids.map((id) => id.replace(versionRegex, '')),
              };
            });
            return acc;
          }, {});
          return topLevel;
        },
        {},
      );
      sidebars.push({version, entries: newSidebar});
    }
    await Promise.all(
      sidebars.map(async (sidebar) => {
        const newSidebar = Object.entries(
          sidebar.entries,
        ).reduce<SidebarEntries>((acc, val) => {
          const key = `version-${sidebar.version}/${val[0]}`;
          acc[key] = Object.entries(val[1]).map((value) => ({
            type: 'category',
            label: value[0],
            items: (value[1] as SidebarEntry[]).map((sidebarItem) => {
              if (typeof sidebarItem === 'string') {
                return {
                  type: 'doc',
                  id: `version-${sidebar.version}/${sidebarItem}`,
                };
              }
              return {
                type: 'category',
                label: sidebarItem.label,
                items: sidebarItem.ids.map((id) => ({
                  type: 'doc',
                  id: `version-${sidebar.version}/${id}`,
                })),
              };
            }),
          }));
          return acc;
        }, {});
        await fs.outputFile(
          path.join(
            newDir,
            'versioned_sidebars',
            `version-${sidebar.version}-sidebars.json`,
          ),
          JSON.stringify(newSidebar, null, 2),
        );
      }),
    );
    context.v2Config.themeConfig.navbar.items.push({
      label: 'Version',
      to: 'docs',
      position: 'right',
      items: [
        {
          label: versions[versions.length - 1],
          to: 'docs/',
          activeBaseRegex: `docs/(?!${versions.join('|')}|next)`,
        },
        ...versions
          .reverse()
          .slice(1)
          .map((version) => ({
            label: version,
            to: `docs/${version}/`,
          })),
        {
          label: 'Main/Unreleased',
          to: `docs/next/`,
          activeBaseRegex: `docs/next/(?!support|team|resources)`,
        },
      ],
    });
  }
}

async function migrateLatestSidebar(context: MigrationContext) {
  const {siteDir, newDir} = context;
  try {
    await fs.copyFile(
      path.join(siteDir, 'sidebars.json'),
      path.join(newDir, 'sidebars.json'),
    );
    context.v2Config.presets[0][1].docs.sidebarPath = path.join(
      path.relative(newDir, siteDir),
      'sidebars.json',
    );
  } catch {
    logger.warn('Sidebar not found. Skipping migration for sidebar');
  }
  if (context.v1Config.colors) {
    const primaryColor = Color(context.v1Config.colors.primaryColor);
    const css = `:root{
  --ifm-color-primary-lightest: ${primaryColor.darken(-0.3).hex()};
  --ifm-color-primary-lighter: ${primaryColor.darken(-0.15).hex()};
  --ifm-color-primary-light: ${primaryColor.darken(-0.1).hex()};
  --ifm-color-primary: ${primaryColor.hex()};
  --ifm-color-primary-dark: ${primaryColor.darken(0.1).hex()};
  --ifm-color-primary-darker: ${primaryColor.darken(0.15).hex()};
  --ifm-color-primary-darkest: ${primaryColor.darken(0.3).hex()};
}
`;
    await fs.outputFile(
      path.join(newDir, 'src', 'css', 'customTheme.css'),
      css,
    );
    context.v2Config.presets[0][1].theme.customCss = path.join(
      path.relative(newDir, path.join(siteDir, '..')),
      'src/css/customTheme.css',
    );
  }
}

async function migrateLatestDocs(context: MigrationContext) {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  if (await fs.pathExists(path.join(siteDir, '..', 'docs'))) {
    context.v2Config.presets[0][1].docs.path = path.join(
      path.relative(newDir, path.join(siteDir, '..')),
      'docs',
    );
    const files = await walk(path.join(siteDir, '..', 'docs'));
    await Promise.all(
      files.map(async (file) => {
        if (path.extname(file) === '.md') {
          const content = await fs.readFile(file, 'utf-8');
          await fs.outputFile(
            file,
            sanitizedFileContent(content, shouldMigrateMdFiles),
          );
        }
      }),
    );
    logger.success('Migrated docs to version 2');
  } else {
    logger.warn('Docs folder not found. Skipping migration for docs');
  }
}

async function migratePackageFile(context: MigrationContext): Promise<void> {
  const {deps, siteDir, newDir} = context;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const packageFile = (await require(`${siteDir}/package.json`)) as {
    scripts?: {[key: string]: string};
    dependencies?: {[key: string]: string};
    devDependencies?: {[key: string]: string};
    [otherKey: string]: unknown;
  };
  packageFile.scripts = {
    ...packageFile.scripts,
    start: 'docusaurus start',
    build: 'docusaurus build',
    swizzle: 'docusaurus swizzle',
    deploy: 'docusaurus deploy',
    docusaurus: 'docusaurus',
  };
  if (packageFile.dependencies) {
    delete packageFile.dependencies.docusaurus;
  }
  if (packageFile.devDependencies) {
    delete packageFile.devDependencies.docusaurus;
  }

  packageFile.dependencies = {
    ...packageFile.dependencies,
    ...deps,
  };
  await fs.outputFile(
    path.join(newDir, 'package.json'),
    JSON.stringify(packageFile, null, 2),
  );
  logger.success('Migrated package.json file');
}

export async function migrateMDToMDX(
  siteDir: string,
  newDir: string,
): Promise<void> {
  await fs.mkdirp(newDir);
  await fs.copy(siteDir, newDir);
  const files = await walk(newDir);
  await Promise.all(
    files.map(async (filePath) => {
      if (path.extname(filePath) === '.md') {
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.outputFile(filePath, sanitizedFileContent(content, true));
      }
    }),
  );
  logger.success`Successfully migrated path=${siteDir} to path=${newDir}`;
}
