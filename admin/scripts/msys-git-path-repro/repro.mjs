/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Standalone CI reproduction for the MSYS/Cygwin Git path bug.
 * See https://github.com/facebook/docusaurus/issues/11920
 *
 * Run this on a Windows runner from inside an MSYS2 / Git Bash shell, where
 * `git` is the MSYS build of Git. In that environment,
 * `git rev-parse --show-toplevel` prints an MSYS-style path such as
 * `/c/Users/runner/work/.../repo` instead of the native `C:\...\repo`.
 *
 * It exercises the REAL `getGitRepoRoot` from the compiled package output and
 * asserts the returned value is a valid native Windows path that exists and is
 * not corrupted by a duplicated drive segment (the symptom of the bug).
 *
 * In the same run it also computes the OLD, unfixed behaviour,
 * `fs.realpath.native(stdout)` on the raw MSYS path, and asserts that it is
 * broken — so a green run documents both the bug trigger and the fix.
 */

import path from 'path';
import fs from 'fs';
import {execFileSync} from 'child_process';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';
import {promisify} from 'util';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

// Async equivalents of the sync fs helpers (the repo lint bans sync fs methods).
const realpathNative = promisify(fs.realpath.native);
async function pathExists(p) {
  try {
    await fs.promises.access(p);
    return true;
  } catch {
    return false;
  }
}

// Compiled package output (`lib`), produced by `pnpm build:packages` /
// postinstall. Require the built module directly because getGitRepoRoot is not
// part of the package's public index.
const libRoot = path.resolve(
  here,
  '..',
  '..',
  '..',
  'packages',
  'docusaurus-utils',
  'lib',
);

const {getGitRepoRoot} = require(path.join(libRoot, 'vcs', 'gitUtils.js'));

const DUPLICATED_DRIVE_RE = /^[a-z]:[\\/][a-z](?:[\\/]|$)/i;
const MSYS_PATH_RE = /^\/[a-z](?:\/|$)/i;

async function main() {
  const repoDir = process.argv[2];
  if (!repoDir) {
    throw new Error('Usage: node repro.mjs <repoDir>');
  }

  console.log('===== MSYS / Cygwin Git path reproduction =====');
  console.log(`process.platform        : ${process.platform}`);
  console.log(`repo dir (cwd)          : ${repoDir}`);

  // 1. Show exactly what the MSYS git prints. This is the trigger condition.
  const rawToplevel = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: repoDir,
    encoding: 'utf8',
  }).trim();
  console.log(`git --show-toplevel     : ${rawToplevel}`);

  const looksLikeMsysPath = MSYS_PATH_RE.test(rawToplevel);
  console.log(`looks like /c/... path  : ${looksLikeMsysPath}`);
  if (!looksLikeMsysPath) {
    throw new Error(
      `Expected git to return an MSYS-style /c/... path but got: ${rawToplevel}\n` +
        'This run is not exercising the MSYS code path, so it proves nothing. ' +
        'Make sure git is the MSYS2 / Git Bash build and the shell is msys2.',
    );
  }

  // 2. Compute the OLD, unfixed behaviour: fs.realpath.native on the raw MSYS
  //    path. This is what getGitRepoRoot did before the fix.
  let unfixedResult = null;
  let unfixedError = null;
  try {
    unfixedResult = await realpathNative(rawToplevel);
  } catch (err) {
    unfixedError = err.message;
  }
  console.log('----- unfixed behaviour: fs.realpath.native(rawStdout) -----');
  console.log(`  result                : ${unfixedResult ?? '(threw)'}`);
  console.log(`  error                 : ${unfixedError ?? '(none)'}`);

  const unfixedIsBroken =
    unfixedError !== null ||
    unfixedResult === null ||
    DUPLICATED_DRIVE_RE.test(unfixedResult) ||
    !(await pathExists(unfixedResult));
  console.log(`  unfixed is broken     : ${unfixedIsBroken}`);

  // The bug must actually reproduce, otherwise the run proves nothing.
  if (!unfixedIsBroken) {
    throw new Error(
      'The unfixed behaviour did NOT reproduce the bug. fs.realpath.native ' +
        'on the raw MSYS path was expected to fail or produce a ' +
        'duplicated-drive path that does not exist.',
    );
  }

  // 3. Run the REAL getGitRepoRoot (the integration point under test).
  const repoRoot = await getGitRepoRoot(repoDir);
  console.log('----- getGitRepoRoot(repoDir) -----');
  console.log(`  returned              : ${repoRoot}`);

  const repoRootIsNative = /^[a-z]:[\\/]/i.test(repoRoot);
  const repoRootHasDuplicatedDrive = DUPLICATED_DRIVE_RE.test(repoRoot);
  const repoRootExists = await pathExists(repoRoot);
  console.log(`  is native C:\\ path    : ${repoRootIsNative}`);
  console.log(`  has duplicated drive  : ${repoRootHasDuplicatedDrive}`);
  console.log(`  path exists on disk   : ${repoRootExists}`);

  const errors = [];
  if (!repoRootIsNative) {
    errors.push(
      `getGitRepoRoot did not return a native Windows path: ${repoRoot}`,
    );
  }
  if (repoRootHasDuplicatedDrive) {
    errors.push(
      `getGitRepoRoot returned a duplicated-drive path: ${repoRoot}`,
    );
  }
  if (!repoRootExists) {
    errors.push(
      `getGitRepoRoot returned a path that does not exist: ${repoRoot}`,
    );
  }

  if (errors.length > 0) {
    console.error('\n===== REPRO RESULT: FAIL =====');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log('\n===== REPRO RESULT: PASS =====');
  console.log(
    'The MSYS path triggered the drive duplication in the unfixed code, and ' +
      'getGitRepoRoot resolved it to a correct existing native path.',
  );
}

main().catch((err) => {
  console.error('\n===== REPRO RESULT: FAIL =====');
  console.error(err);
  process.exit(1);
});
