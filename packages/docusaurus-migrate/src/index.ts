/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as fs from 'fs-extra';
import importFresh from 'import-fresh';

import {VersionOneConfig, VersionTwoConfig} from './types';
import extractMetadata from './metaData';

const DOCUSAURUS_VERSION = '^2.0.0-alpha.58';

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

function sanitizeFrontMatter(content: string): string {
  const extractedData = extractMetadata(content);
  const extractedMetaData = Object.entries(extractedData.metadata).reduce(
    (metaData, value) => {
      return `${metaData}\n${value[0]}: ${
        value[0] === 'tags' ? value[1] : `"${value[1]}"`
      }`;
    },
    '',
  );
  const sanitizedData = `---\n${extractedMetaData}\n---\n${extractedData.rawContent}`;
  return sanitizedData;
}

export async function migrateDocusaurusProject(
  siteDir: string,
  newDir: string,
): Promise<void> {
  const siteConfig = importFresh(`${siteDir}/siteConfig`) as VersionOneConfig;
  const config = createConfigFile(siteConfig);
  const classicPreset = config.presets[0][1];

  const deps: {[key: string]: string} = {
    '@docusaurus/core': DOCUSAURUS_VERSION,
    '@docusaurus/preset-classic': DOCUSAURUS_VERSION,
    clsx: '^1.1.1',
    react: '^16.10.2',
    'react-dom': '^16.10.2',
  };
  createClientRedirects(siteConfig, deps, config);
  createLandingPage(newDir, siteDir);
  migrateStaticFiles(siteDir, newDir);
  migrateBlogFiles(siteDir, newDir, classicPreset);
  handleVersioning(siteDir, newDir, config);
  migrateLatestDocs(siteDir, newDir);
  migrateLatestSidebar(siteDir, newDir, classicPreset, siteConfig);
  fs.writeFileSync(
    `${newDir}/docusaurus.config.js`,
    `module.exports=${JSON.stringify(config, null, 2)}`,
  );
  migratePackageFile(siteDir, deps, newDir);
}

export function createConfigFile(
  siteConfig: VersionOneConfig,
): VersionTwoConfig {
  const homePageId = siteConfig.headerLinks?.filter((value) => value.doc)[0]
    .doc;
  return {
    title: siteConfig.title ?? '',
    tagline: siteConfig.tagline,
    url: siteConfig.url ?? '',
    baseUrl: siteConfig.baseUrl ?? '',
    organizationName: siteConfig.organizationName,
    projectName: siteConfig.projectName,
    scripts: siteConfig.scripts,
    stylesheets: siteConfig.stylesheets,
    favicon: siteConfig.favicon ?? '',
    customFields: {
      users: siteConfig.users,
    },
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            path: 'docs',
            homePageId,
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
            editUrl: siteConfig.editUrl,
          },
          blog: {},
          theme: {},
        },
      ],
    ],
    plugins: [],
    themeConfig: {
      navbar: {
        title: siteConfig.title,
        logo: {
          src: siteConfig.headerIcon,
        },
        image: siteConfig.ogImage,
        links: (siteConfig.headerLinks ?? [])
          .map((link) => {
            if (link.doc) {
              return {
                to: `docs/${link.doc === homePageId ? '' : link.doc}`,
                label: link.label,
                position: 'left',
              };
            }
            if (link.page) {
              return {
                to: `/${link.page}`,
                label: link.label,
                position: 'left',
              };
            }
            if (link.href) {
              return {...link, position: 'left'};
            }
            return null;
          })
          .filter(Boolean),
      },
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

function createClientRedirects(
  siteConfig: VersionOneConfig,
  deps: {[key: string]: string},
  config: VersionTwoConfig,
): void {
  if (!siteConfig.cleanUrl) {
    deps['@docusaurus/plugin-client-redirects'] = DOCUSAURUS_VERSION;
    config.plugins.push([
      '@docusaurus/plugin-client-redirects',
      {fromExtensions: ['html']},
    ]);
  }
}

function createLandingPage(newDir: string, siteDir: string): void {
  fs.mkdirpSync(`${newDir}/src/pages`);
  try {
    fs.statSync(`${siteDir}/pages/en`);
    const indexPage = `import Layout from "@theme/Layout";
    import React from "react";
    
    export default () => {
      return <Layout />;
    };
    `;
    fs.writeFileSync(`${newDir}/src/pages/index.js`, indexPage);
  } catch {
    console.log('Ignoring Pages');
  }
}

function migrateStaticFiles(siteDir: string, newDir: string) {
  try {
    fs.statSync(`${siteDir}/static`);
    fs.copySync(`${siteDir}/static`, `${newDir}/static`);
  } catch {
    console.log('Ignoring static assets');
    fs.mkdirSync(`${newDir}/static`);
  }
}

function migrateBlogFiles(
  siteDir: string,
  newDir: string,
  classicPreset: {
    docs: {[key: string]: any};
    blog: {[key: string]: any};
    theme: {[key: string]: any};
  },
) {
  try {
    fs.statSync(`${siteDir}/blog`);
    fs.copySync(`${siteDir}/blog`, `${newDir}/blog`);
    const files = walk(`${newDir}/blog`);
    files.forEach((file) => {
      const content = String(fs.readFileSync(file));
      fs.writeFileSync(file, sanitizeFrontMatter(content));
    });
    classicPreset.blog.path = 'blog';
  } catch {
    console.log('No Blog found');
  }
}

function handleVersioning(
  siteDir: string,
  newDir: string,
  config: VersionTwoConfig,
) {
  let isVersion = false;
  try {
    fs.statSync(`${siteDir}/versions.json`);
    isVersion = true;
  } catch {
    console.log('Unversioned docs');
  }
  if (isVersion) {
    const loadedVersions: Array<string> = JSON.parse(
      String(fs.readFileSync(`${siteDir}/versions.json`)),
    );
    fs.copyFile(`${siteDir}/versions.json`, `${newDir}/versions.json`);
    const versions = loadedVersions.reverse();
    const versionRegex = new RegExp(`version-(${versions.join('|')})-`, 'mgi');
    migrateVersionedSidebar(siteDir, newDir, versions, versionRegex, config);
    fs.mkdirpSync(`${newDir}/versioned_docs`);
    migrateVersionedDocs(versions, siteDir, newDir, versionRegex);
  }
}

function migrateVersionedDocs(
  versions: string[],
  siteDir: string,
  newDir: string,
  versionRegex: RegExp,
) {
  versions.reverse().forEach((version, index) => {
    if (index === 0) {
      fs.copySync(
        `${siteDir}/../docs`,
        `${newDir}/versioned_docs/version-${version}`,
      );
      fs.copySync(
        `${siteDir}/versioned_docs/version-${version}`,
        `${newDir}/versioned_docs/version-${version}`,
      );
      return;
    }
    try {
      fs.mkdirsSync(`${newDir}/versioned_docs/version-${version}`);
      fs.copySync(
        `${newDir}/versioned_docs/version-${versions[index - 1]}`,
        `${newDir}/versioned_docs/version-${version}`,
      );
      fs.copySync(
        `${siteDir}/versioned_docs/version-${version}`,
        `${newDir}/versioned_docs/version-${version}`,
      );
    } catch {
      fs.copySync(
        `${newDir}/versioned_docs/version-${versions[index - 1]}`,
        `${newDir}/versioned_docs/version-${version}`,
      );
    }
  });
  const files = walk(`${newDir}/versioned_docs`);
  files.forEach((path) => {
    const content = fs.readFileSync(path).toString();
    fs.writeFileSync(
      path,
      sanitizeFrontMatter(content.replace(versionRegex, '')),
    );
  });
}

function migrateVersionedSidebar(
  siteDir: string,
  newDir: string,
  versions: string[],
  versionRegex: RegExp,
  config: VersionTwoConfig,
) {
  let isVersionedSidebar = false;
  try {
    fs.statSync(`${siteDir}/versioned_sidebars`);
    isVersionedSidebar = true;
  } catch {
    console.log('No sidebar found');
  }
  if (isVersionedSidebar) {
    fs.mkdirpSync(`${newDir}/versioned_sidebars`);
    const sidebars: {
      enteries: {[key: string]: object | Array<object | string>};
      version: string;
    }[] = [];
    versions.forEach((version, index) => {
      let sidebar: {[key: string]: object | Array<object | string>};
      const sidebarPath = `${siteDir}/versioned_sidebars/version-${version}-sidebars.json`;
      try {
        fs.statSync(sidebarPath);
        sidebar = JSON.parse(String(fs.readFileSync(sidebarPath)));
      } catch {
        sidebars.push({version, enteries: sidebars[index - 1].enteries});
        return;
      }
      const newSidebar = Object.entries(sidebar).reduce(
        (topLevel: {[key: string]: any}, value) => {
          const key = value[0].replace(versionRegex, '');
          // eslint-disable-next-line no-param-reassign
          topLevel[key] = Object.entries(value[1]).reduce(
            (acc: {[key: string]: Array<object | string>}, val) => {
              acc[val[0].replace(versionRegex, '')] = (val[1] as Array<
                any
              >).map((item) => {
                if (typeof item === 'string') {
                  return item.replace(versionRegex, '');
                }
                return {
                  type: 'category',
                  label: item.label,
                  ids: item.ids.map((id: string) =>
                    id.replace(versionRegex, ''),
                  ),
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
      sidebars.push({version, enteries: newSidebar});
    });
    sidebars.forEach((sidebar) => {
      const newSidebar = Object.entries(sidebar.enteries).reduce(
        (acc: {[key: string]: any}, val) => {
          const key = `version-${sidebar.version}/${val[0]}`;
          // eslint-disable-next-line prefer-destructuring
          acc[key] = Object.entries(val[1]).map((value) => {
            return {
              type: 'category',
              label: value[0],
              items: (value[1] as Array<any>).map((sidebarItem) => {
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
            };
          });
          return acc;
        },
        {},
      );
      fs.writeFileSync(
        `${newDir}/versioned_sidebars/version-${sidebar.version}-sidebars.json`,
        JSON.stringify(newSidebar, null, 2),
      );
    });
    config.themeConfig.navbar.links.push({
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
          label: 'Master/Unreleased',
          to: `docs/next/`,
          activeBaseRegex: `docs/next/(?!support|team|resources)`,
        },
      ],
    });
  }
}

function migrateLatestSidebar(
  siteDir: string,
  newDir: string,
  classicPreset: {
    docs: {[key: string]: any};
    blog: {[key: string]: any};
    theme: {[key: string]: any};
  },
  siteConfig: VersionOneConfig,
) {
  try {
    fs.copyFileSync(`${siteDir}/sidebars.json`, `${newDir}/sidebars.json`);
    classicPreset.docs.sidebarPath = `${newDir}/sidebars.json`;
  } catch {
    console.log('Ignoring sidebar');
  }
  if (siteConfig.colors) {
    const css = `
      :root{
        --ifm-color-primary: ${siteConfig.colors.primaryColor};
      }
      `;
    fs.mkdirpSync(`${newDir}/src/css/`);
    fs.writeFileSync(`${newDir}/src/css/customTheme.css`, css);
    classicPreset.theme.customCss = `${newDir}/src/css/customTheme.css`;
  }
}

function migrateLatestDocs(siteDir: string, newDir: string) {
  try {
    fs.copySync(`${siteDir}/../docs`, `${newDir}/docs`);
    const files = walk(`${newDir}/docs`);
    files.forEach((file) => {
      const content = String(fs.readFileSync(file));
      fs.writeFileSync(file, sanitizeFrontMatter(content));
    });
  } catch {
    fs.mkdir(`${newDir}/docs`);
  }
}

function migratePackageFile(
  siteDir: string,
  deps: {[key: string]: string},
  newDir: string,
) {
  const packageFile = importFresh(`${siteDir}/package.json`) as {
    [key: string]: any;
  };
  packageFile.scripts = {
    ...packageFile.scripts,
    start: 'docusaurus start',
    build: 'docusaurus build',
    swizzle: 'docusaurus swizzle',
    deploy: 'docusaurus deploy',
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
    `${newDir}/package.json`,
    JSON.stringify(packageFile, null, 2),
  );
}
