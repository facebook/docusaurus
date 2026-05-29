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
 * broken, so a single green run documents both the bug and the fix.
 *
 * Set MSYS_REPRO_MODE=nofix to make the assertion target the OLD behaviour
 * instead, which produces a genuine failing run.
 */

import path from 'path';
import fs from 'fs';
import {execFileSync} from 'child_process';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

// The compiled package output (lib), produced by `yarn build:packages`. We
// require the built module files directly because getGitRepoRoot is
// intentionally not part of the package's public index.
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
const {fromGitPathToNativePath} = require(path.join(libRoot, 'pathUtils.js'));

const DUPLICATED_DRIVE_RE = /^[a-z]:[\\/][a-z]([\\/]|$)/i;
const MSYS_PATH_RE = /^\/[a-z](\/|$)/i;

async function main() {
  const repoDir = process.argv[2];
  if (!repoDir) {
    throw new Error('Usage: node repro.mjs <repoDir>');
  }

  const mode = process.env.MSYS_REPRO_MODE === 'nofix' ? 'nofix' : 'fixed';

  console.log('===== MSYS / Cygwin Git path reproduction =====');
  console.log(`process.platform        : ${process.platform}`);
  console.log(`mode                    : ${mode}`);
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
  //    path. This is what the code did before the fix.
  let unfixedResult = null;
  let unfixedError = null;
  try {
    unfixedResult = fs.realpathSync.native(rawToplevel);
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
    !fs.existsSync(unfixedResult);
  console.log(`  unfixed is broken     : ${unfixedIsBroken}`);

  // 3. Show what the fix produces for the same input, in isolation.
  const normalized = fromGitPathToNativePath(rawToplevel);
  console.log('----- fix: fromGitPathToNativePath(rawStdout) -----');
  console.log(`  normalized            : ${normalized}`);

  // 4. Run the REAL getGitRepoRoot (the fixed integration point).
  const repoRoot = await getGitRepoRoot(repoDir);
  console.log('----- getGitRepoRoot(repoDir) -----');
  console.log(`  returned              : ${repoRoot}`);

  const repoRootIsNative = /^[a-z]:[\\/]/i.test(repoRoot);
  const repoRootHasDuplicatedDrive = DUPLICATED_DRIVE_RE.test(repoRoot);
  const repoRootExists = fs.existsSync(repoRoot);
  console.log(`  is native C:\\ path    : ${repoRootIsNative}`);
  console.log(`  has duplicated drive  : ${repoRootHasDuplicatedDrive}`);
  console.log(`  path exists on disk   : ${repoRootExists}`);

  const errors = [];

  // The bug must actually reproduce, otherwise the run proves nothing.
  if (!unfixedIsBroken) {
    errors.push(
      'The unfixed behaviour did NOT reproduce the bug. fs.realpath.native ' +
        'on the raw MSYS path was expected to fail or produce a ' +
        'duplicated-drive path that does not exist.',
    );
  }

  if (mode === 'fixed') {
    // Assert the fixed code is correct.
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
  } else {
    // nofix mode: assert against the OLD behaviour so the run goes RED,
    // producing a genuine failing CI run that documents the bug.
    console.log(
      '----- nofix mode: asserting the OLD fs.realpath.native(stdout) -----',
    );
    if (unfixedError !== null) {
      errors.push(
        `Unfixed code threw on the MSYS path (this is the bug): ${unfixedError}`,
      );
    } else {
      if (DUPLICATED_DRIVE_RE.test(unfixedResult)) {
        errors.push(
          'Unfixed code produced a duplicated-drive path (this is the bug): ' +
            unfixedResult,
        );
      }
      if (!fs.existsSync(unfixedResult)) {
        errors.push(
          'Unfixed code produced a path that does not exist (this is the bug): ' +
            unfixedResult,
        );
      }
    }
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
  console.error(err);
  process.exit(1);
});
