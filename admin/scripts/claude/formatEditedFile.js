#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Claude Code PostToolUse hook (see .claude/settings.json): formats the file
// that Claude edited with oxfmt.
// oxfmt skips the files it doesn't support or ignores, like `pnpm format`,
// and its errors are ignored: they must not interrupt Claude.

import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {text} from 'node:stream/consumers';
import {fileURLToPath} from 'node:url';

const oxfmtBin = fileURLToPath(
  new URL('bin/oxfmt', import.meta.resolve('oxfmt/package.json')),
);

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const {tool_input: toolInput} = JSON.parse(await text(process.stdin));
const relativeFilePath = path.relative(projectDir, toolInput.file_path ?? '');

const isInProject =
  relativeFilePath !== '' &&
  !relativeFilePath.startsWith('..') &&
  !path.isAbsolute(relativeFilePath);

if (isInProject) {
  spawnSync(
    process.execPath,
    [oxfmtBin, '--no-error-on-unmatched-pattern', relativeFilePath],
    {cwd: projectDir, stdio: 'ignore'},
  );
}
