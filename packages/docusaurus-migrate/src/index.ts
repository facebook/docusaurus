/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import logger from '@docusaurus/logger';
import glob from 'glob';
import Color from 'color';

import type {
  SidebarEntry,
  SidebarEntries,
  VersionOneConfig,
  VersionTwoConfig,
} from './types';
import extractMetadata, {shouldQuotifyFrontMatter} from './frontMatter';
import migratePage from './transform';
import sanitizeMD from './sanitizeMD';
import path from 'path';

const DOCUSAURUS_VERSION = (importFresh('../package.json') as {version: string})
  .version;

export function walk(dir: string): Array<string> {
  let results: Array<string> = [];
  const list = fs.readdirSync(dir);
  list.forEach((file: string) => {
    const fullPath = `${dir}/${file}`;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

function sanitizedFileContent(
  content: string,
  migrateMDFiles: boolean,
): string {
  const extractedData = extractMetadata(content);
  const extractedMetaData = Object.entries(extractedData.metadata).reduce(
    (metaData, [key, value]) =>
      `${metaData}\n${key}: ${
        shouldQuotifyFrontMatter([key, value]) ? `"${value}"` : value
      }`,
    '',
  );
  const sanitizedData = `---${extractedMetaData}\n---\n${
    migrateMDFiles
      ? sanitizeMD(extractedData.rawContent)
      : extractedData.rawContent
  }`;
  return sanitizedData;
}

type MigrationContext = {
  siteDir: string;
  newDir: string;
  deps: Record<string, string>;
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
    const v1Config = importFresh(`${siteDir}/siteConfig`) as VersionOneConfig;
    logger.info('Starting migration from v1 to v2...');
    const deps: Record<string, string> = {
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
  } catch (e) {
    logger.error(`Failed to creating redirects: ${e}`);
    errorCount += 1;
  }
  if (shouldMigratePages) {
    try {
      createPages(migrationContext);
      logger.success(
        'Created new doc pages (check migration page for more details)',
      );
    } catch (e) {
      logger.error(`Failed to create new doc pages: ${e}`);
      errorCount += 1;
    }
  } else {
    try {
      createDefaultLandingPage(migrationContext);
      logger.success(
        'Created landing page (check migration page for more details)',
      );
    } catch (e) {
      logger.error(`Failed to create landing page: ${e}`);
      errorCount += 1;
    }
  }

  try {
    migrateStaticFiles(migrationContext);
    logger.success('Migrated static folder');
  } catch (e) {
    logger.error(`Failed to copy static folder: ${e}`);
    errorCount += 1;
  }
  try {
    migrateBlogFiles(migrationContext);
  } catch (e) {
    logger.error(`Failed to migrate blogs: ${e}`);
    errorCount += 1;
  }
  try {
    handleVersioning(migrationContext);
  } catch (e) {
    logger.error(`Failed to migrate versioned docs: ${e}`);
    errorCount += 1;
  }

  try {
    migrateLatestDocs(migrationContext);
  } catch (e) {
    logger.error(`Failed to migrate docs: ${e}`);
    errorCount += 1;
  }

  try {
    migrateLatestSidebar(migrationContext);
  } catch (e) {
    logger.error(`Failed to migrate sidebar: ${e}`);
    errorCount += 1;
  }

  try {
    fs.writeFileSync(
      path.join(newDir, 'docusaurus.config.js'),
      `module.exports=${JSON.stringify(migrationContext.v2Config, null, 2)}`,
    );
    logger.success(
      `Created a new config file with new navbar and footer config`,
    );
  } catch (e) {
    logger.error(`Failed to create config file: ${e}`);
    errorCount += 1;
  }
  try {
    await migratePackageFile(migrationContext);
  } catch (e) {
    logger.error(
      `Error occurred while creating package.json file for project: ${e}`,
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
  const customConfigFields: Record<string, unknown> = {};
  // add fields that are unknown to v2 to customConfigFields
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

function createPages(context: MigrationContext): void {
  const {newDir, siteDir} = context;
  fs.mkdirpSync(path.join(newDir, 'src', 'pages'));
  if (fs.existsSync(path.join(siteDir, 'pages', 'en'))) {
    try {
      fs.copySync(
        path.join(siteDir, 'pages', 'en'),
        path.join(newDir, 'src', 'pages'),
      );
      const files = glob.sync('**/*.js', {
        cwd: path.join(newDir, 'src', 'pages'),
      });
      files.forEach((file) => {
        const filePath = path.join(newDir, 'src', 'pages', file);
        const content = String(fs.readFileSync(filePath));
        fs.writeFileSync(filePath, migratePage(content));
      });
    } catch (e) {
      logger.error(`Unable to migrate Pages: ${e}`);
      createDefaultLandingPage(context);
    }
  } else {
    logger.info('Ignoring Pages');
  }
}

function createDefaultLandingPage({newDir}: MigrationContext) {
  const indexPage = `import Layout from "@theme/Layout";
      import React from "react";

      export default () => {
        return <Layout />;
      };
      `;
  fs.mkdirpSync(`${newDir}/src/pages/`);
  fs.writeFileSync(`${newDir}/src/pages/index.js`, indexPage);
}

function migrateStaticFiles({siteDir, newDir}: MigrationContext): void {
  if (fs.existsSync(path.join(siteDir, 'static'))) {
    fs.copySync(path.join(siteDir, 'static'), path.join(newDir, 'static'));
  } else {
    fs.mkdirSync(path.join(newDir, 'static'));
  }
}

function migrateBlogFiles(context: MigrationContext): void {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  if (fs.existsSync(path.join(siteDir, 'blog'))) {
    fs.copySync(path.join(siteDir, 'blog'), path.join(newDir, 'blog'));
    const files = walk(path.join(newDir, 'blog'));
    files.forEach((file) => {
      const content = String(fs.readFileSync(file));
      fs.writeFileSync(
        file,
        sanitizedFileContent(content, shouldMigrateMdFiles),
      );
    });
    context.v2Config.presets[0][1].blog.path = 'blog';
    logger.success('Migrated blogs to version 2 with change in front matter');
  } else {
    logger.warn('Blog not found. Skipping migration for blog');
  }
}

function handleVersioning(context: MigrationContext): void {
  const {siteDir, newDir} = context;
  if (fs.existsSync(path.join(siteDir, 'versions.json'))) {
    const loadedVersions: Array<string> = JSON.parse(
      String(fs.readFileSync(path.join(siteDir, 'versions.json'))),
    );
    fs.copyFileSync(
      path.join(siteDir, 'versions.json'),
      path.join(newDir, 'versions.json'),
    );
    const versions = loadedVersions.reverse();
    const versionRegex = new RegExp(`version-(${versions.join('|')})-`, 'mgi');
    migrateVersionedSidebar(context, versions, versionRegex);
    fs.mkdirpSync(path.join(newDir, 'versioned_docs'));
    migrateVersionedDocs(context, versions, versionRegex);
    logger.success`Migrated version docs and sidebar. The following doc versions have been created:name=${loadedVersions}`;
  } else {
    logger.warn(
      'Versioned docs not found. Skipping migration for versioned docs',
    );
  }
}

function migrateVersionedDocs(
  context: MigrationContext,
  versions: string[],
  versionRegex: RegExp,
): void {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  versions.reverse().forEach((version, index) => {
    if (index === 0) {
      fs.copySync(
        path.join(siteDir, '..', context.v1Config.customDocsPath || 'docs'),
        path.join(newDir, 'versioned_docs', `version-${version}`),
      );
      fs.copySync(
        path.join(siteDir, 'versioned_docs', `version-${version}`),
        path.join(newDir, 'versioned_docs', `version-${version}`),
      );
      return;
    }
    try {
      fs.mkdirsSync(path.join(newDir, 'versioned_docs', `version-${version}`));
      fs.copySync(
        path.join(newDir, 'versioned_docs', `version-${versions[index - 1]}`),
        path.join(newDir, 'versioned_docs', `version-${version}`),
      );
      fs.copySync(
        path.join(siteDir, 'versioned_docs', `version-${version}`),
        path.join(newDir, 'versioned_docs', `version-${version}`),
      );
    } catch {
      fs.copySync(
        path.join(newDir, 'versioned_docs', `version-${versions[index - 1]}`),
        path.join(newDir, 'versioned_docs', `version-${version}`),
      );
    }
  });
  const files = walk(path.join(newDir, 'versioned_docs'));
  files.forEach((pathToFile) => {
    if (path.extname(pathToFile) === '.md') {
      const content = fs.readFileSync(pathToFile).toString();
      fs.writeFileSync(
        pathToFile,
        sanitizedFileContent(
          content.replace(versionRegex, ''),
          shouldMigrateMdFiles,
        ),
      );
    }
  });
}

function migrateVersionedSidebar(
  context: MigrationContext,
  versions: string[],
  versionRegex: RegExp,
): void {
  const {siteDir, newDir} = context;
  if (fs.existsSync(path.join(siteDir, 'versioned_sidebars'))) {
    fs.mkdirpSync(path.join(newDir, 'versioned_sidebars'));
    const sidebars: {
      entries: SidebarEntries;
      version: string;
    }[] = [];
    versions.forEach((version, index) => {
      let sidebarEntries: SidebarEntries;
      const sidebarPath = path.join(
        siteDir,
        'versioned_sidebars',
        `version-${version}-sidebars.json`,
      );
      try {
        fs.statSync(sidebarPath);
        sidebarEntries = JSON.parse(String(fs.readFileSync(sidebarPath)));
      } catch {
        sidebars.push({version, entries: sidebars[index - 1].entries});
        return;
      }
      const newSidebar = Object.entries(sidebarEntries).reduce(
        (topLevel: SidebarEntries, value) => {
          const key = value[0].replace(versionRegex, '');
          topLevel[key] = Object.entries(value[1]).reduce(
            (
              acc: {[key: string]: Array<Record<string, unknown> | string>},
              val,
            ) => {
              acc[val[0].replace(versionRegex, '')] = (
                val[1] as Array<SidebarEntry>
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
            },
            {},
          );
          return topLevel;
        },
        {},
      );
      sidebars.push({version, entries: newSidebar});
    });
    sidebars.forEach((sidebar) => {
      const newSidebar = Object.entries(sidebar.entries).reduce(
        (acc: SidebarEntries, val) => {
          const key = `version-${sidebar.version}/${val[0]}`;
          acc[key] = Object.entries(val[1]).map((value) => ({
            type: 'category',
            label: value[0],
            items: (value[1] as Array<SidebarEntry>).map((sidebarItem) => {
              if (typeof sidebarItem === 'string') {
                return {
                  type: 'doc',
                  id: `version-${sidebar.version}/${sidebarItem}`,
                };
              }
              return {
                type: 'category',
                label: sidebarItem.label,
                items: sidebarItem.ids.map((id: string) => ({
                  type: 'doc',
                  id: `version-${sidebar.version}/${id}`,
                })),
              };
            }),
          }));
          return acc;
        },
        {},
      );
      fs.writeFileSync(
        path.join(
          newDir,
          'versioned_sidebars',
          `version-${sidebar.version}-sidebars.json`,
        ),
        JSON.stringify(newSidebar, null, 2),
      );
    });
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

function migrateLatestSidebar(context: MigrationContext): void {
  const {siteDir, newDir} = context;
  try {
    fs.copyFileSync(
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
    fs.mkdirpSync(path.join(newDir, 'src', 'css'));
    fs.writeFileSync(path.join(newDir, 'src', 'css', 'customTheme.css'), css);
    context.v2Config.presets[0][1].theme.customCss = path.join(
      path.relative(newDir, path.join(siteDir, '..')),
      'src',
      'css',
      'customTheme.css',
    );
  }
}

function migrateLatestDocs(context: MigrationContext): void {
  const {siteDir, newDir, shouldMigrateMdFiles} = context;
  if (fs.existsSync(path.join(siteDir, '..', 'docs'))) {
    context.v2Config.presets[0][1].docs.path = path.join(
      path.relative(newDir, path.join(siteDir, '..')),
      'docs',
    );
    const files = walk(path.join(siteDir, '..', 'docs'));
    files.forEach((file) => {
      if (path.extname(file) === '.md') {
        const content = fs.readFileSync(file).toString();
        fs.writeFileSync(
          file,
          sanitizedFileContent(content, shouldMigrateMdFiles),
        );
      }
    });
    logger.success('Migrated docs to version 2');
  } else {
    logger.warn('Docs folder not found. Skipping migration for docs');
  }
}

async function migratePackageFile(context: MigrationContext): Promise<void> {
  const {deps, siteDir, newDir} = context;
  const packageFile = importFresh(`${siteDir}/package.json`) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
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
  fs.writeFileSync(
    path.join(newDir, 'package.json'),
    JSON.stringify(packageFile, null, 2),
  );
  logger.success('Migrated package.json file');
}

export async function migrateMDToMDX(
  siteDir: string,
  newDir: string,
): Promise<void> {
  fs.mkdirpSync(newDir);
  fs.copySync(siteDir, newDir);
  const files = walk(newDir);
  files.forEach((filePath) => {
    if (path.extname(filePath) === '.md') {
      const content = fs.readFileSync(filePath).toString();
      fs.writeFileSync(filePath, sanitizedFileContent(content, true));
    }
  });
  logger.success`Successfully migrated path=${siteDir} to path=${newDir}`;
}
