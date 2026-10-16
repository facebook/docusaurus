#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Checks the pnpm catalogs, complementing what Syncpack can't check:
// Syncpack doesn't compare catalog entries with each other, nor with the
// explicit versions of the site templates, which can't use catalogs.

import fs from 'node:fs/promises';
import path from 'node:path';
import {load as loadYaml} from 'js-yaml';
import {logger} from '@docusaurus/logger';

const rootDir = path.resolve(import.meta.dirname, '../..');

async function readYaml(filePath) {
  return loadYaml(await fs.readFile(path.join(rootDir, filePath), 'utf8'));
}

async function readPackageJson(filePath) {
  return JSON.parse(await fs.readFile(path.join(rootDir, filePath), 'utf8'));
}

async function listPackageJsons(dir) {
  const names = await fs.readdir(path.join(rootDir, dir));
  const filePaths = names.map((name) => `${dir}/${name}/package.json`);
  const exists = await Promise.all(
    filePaths.map((filePath) =>
      fs.access(path.join(rootDir, filePath)).then(
        () => true,
        () => false,
      ),
    ),
  );
  return filePaths.filter((_, index) => exists[index]);
}

const workspace = await readYaml('pnpm-workspace.yaml');
const defaultCatalog = workspace.catalog ?? {};
const devCatalog = workspace.catalogs?.dev ?? {};

const packageJsonPaths = [
  'package.json',
  ...(await listPackageJsons('packages')),
  'website/package.json',
  'argos/package.json',
  'admin/scripts/package.json',
];
const templatePackageJsonPaths = await listPackageJsons(
  'packages/create-docusaurus/templates',
);

const RuntimeDependencyTypes = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
];

const errors = [];

// Dev catalog entries must only be used by devDependencies
// Default catalog entries must be used at runtime by at least one package
const runtimeDependencies = new Set();
for (const packageJsonPath of packageJsonPaths) {
  const packageJson = await readPackageJson(packageJsonPath);
  for (const dependencyType of [...RuntimeDependencyTypes, 'devDependencies']) {
    const dependencies = packageJson[dependencyType] ?? {};
    for (const [name, specifier] of Object.entries(dependencies)) {
      if (specifier === 'catalog:dev' && dependencyType !== 'devDependencies') {
        errors.push(
          `${packageJsonPath}: ${dependencyType} ${name} can't use the dev catalog, move it to the default catalog`,
        );
      }
      if (
        RuntimeDependencyTypes.includes(dependencyType) &&
        !specifier.startsWith('workspace:')
      ) {
        runtimeDependencies.add(name);
      }
    }
  }
}
for (const name of Object.keys(defaultCatalog)) {
  if (!runtimeDependencies.has(name)) {
    errors.push(
      `pnpm-workspace.yaml: ${name} isn't used at runtime (dependencies, optionalDependencies, peerDependencies), move it to the dev catalog`,
    );
  }
}
for (const name of Object.keys(devCatalog)) {
  if (name in defaultCatalog) {
    errors.push(
      `pnpm-workspace.yaml: ${name} is declared in both the default and dev catalogs`,
    );
  }
}

const catalogVersions = {...devCatalog, ...defaultCatalog};

// Site templates can't use catalogs: their versions must match the catalog
for (const packageJsonPath of templatePackageJsonPaths) {
  const packageJson = await readPackageJson(packageJsonPath);
  for (const dependencyType of ['dependencies', 'devDependencies']) {
    const dependencies = packageJson[dependencyType] ?? {};
    for (const [name, specifier] of Object.entries(dependencies)) {
      if (name in catalogVersions && catalogVersions[name] !== specifier) {
        errors.push(
          `${packageJsonPath}: ${dependencyType} ${name} is ${specifier}, but ${catalogVersions[name]} in the catalog`,
        );
      }
    }
  }
}

// pnpm overrides can't use catalogs: their versions must match the catalog
for (const [name, version] of Object.entries(workspace.overrides ?? {})) {
  if (name in catalogVersions && catalogVersions[name] !== version) {
    errors.push(
      `pnpm-workspace.yaml: override ${name} is ${version}, but ${catalogVersions[name]} in the catalog`,
    );
  }
}

// Members of a Dependabot group must use the same version
const dependabot = await readYaml('.github/dependabot.yml');
const npmGroups =
  dependabot.updates.find((update) => update['package-ecosystem'] === 'npm')
    ?.groups ?? {};
function toRegExp(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replaceAll('*', '.*')}$`);
}
for (const [groupName, group] of Object.entries(npmGroups)) {
  const regExps = group.patterns.map(toRegExp);
  const members = Object.entries(catalogVersions).filter(([name]) =>
    regExps.some((regExp) => regExp.test(name)),
  );
  const versions = new Set(members.map(([, version]) => version));
  if (versions.size > 1) {
    errors.push(
      `pnpm-workspace.yaml: the packages of the "${groupName}" Dependabot group must use the same version: ${members
        .map(([name, version]) => `${name}@${version}`)
        .join(', ')}`,
    );
  }
}

if (errors.length > 0) {
  logger.error(`Catalog issues found:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
logger.success('No catalog issues found');
