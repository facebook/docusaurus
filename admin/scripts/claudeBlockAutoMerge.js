#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Claude Code PreToolUse hook (see .claude/settings.json): blocks Bash
// commands running `gh pr merge --auto`.
// The repo doesn't use auto-merge, so --auto merges immediately, even with
// running CI checks, see https://github.com/meta/docusaurus/pull/12511

import {text} from 'node:stream/consumers';

const {tool_input: toolInput} = JSON.parse(await text(process.stdin));
// The shell removes quotes, so `"--auto"` or `bash -c '…'` still pass --auto
const command = (toolInput.command ?? '').replaceAll(/["']/g, '');

if (/\bgh\b[^;&|]*\spr\s+merge\b[^;&|]*\s--auto\b/.test(command)) {
  console.error(
    'Blocked: never use `gh pr merge --auto`, it merges immediately. Wait for all the CI checks to be green, then merge without --auto. See .agents/skills/pull-requests/SKILL.md',
  );
  process.exit(2);
}
