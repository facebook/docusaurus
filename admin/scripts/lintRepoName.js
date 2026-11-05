#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Checks that the repository files use the current GitHub repository name.
// See https://github.com/meta/docusaurus/pull/12818

import path from 'node:path';
import {execa} from 'execa';
import {logger} from '@docusaurus/logger';

const RootDir = path.resolve(import.meta.dirname, '../..');

const FormerNamePattern = String.raw`facebook(/|%2F)docusaurus|facebook\.github\.io/docusaurus`;

const IgnoredPathspecs = [
  // History
  'CHANGELOG.md',
  'CHANGELOG-v2.md',
  'website/blog',
  'website/versioned_docs',
  // Generated from the init templates at release time
  'examples',
  // Placeholder data
  '**/__tests__/**',
  '**/*.test.*',
];

async function main() {
  const matches = await findFormerNameMatches();

  if (matches.length > 0) {
    logger.error(
      `Found references to the former repository name, use meta/docusaurus instead:\n${matches.join('\n')}`,
    );
    process.exit(1);
  }
  logger.success('No reference to the former repository name found');
}

/** @returns {Promise<string[]>} "path:line:content" lines */
async function findFormerNameMatches() {
  const excludedPathspecs = IgnoredPathspecs.map((pathspec) => `:!${pathspec}`);
  const result = await execa(
    'git',
    [
      'grep',
      '--line-number',
      // Skip binary files
      '-I',
      '--extended-regexp',
      FormerNamePattern,
      '--',
      '.',
      ...excludedPathspecs,
    ],
    {cwd: RootDir, reject: false},
  );

  // git grep exits with 1 when nothing matches
  if (result.exitCode === 1) {
    return [];
  }
  if (result.exitCode !== 0) {
    throw new Error(`git grep failed:\n${result.stderr}`);
  }
  return result.stdout.split('\n');
}

await main();
