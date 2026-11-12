/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Action, History, Location, TransitionPromptHook} from 'history';

type Prompt = Parameters<History['block']>[0];
type BlockerResult = ReturnType<TransitionPromptHook>;

/**
 * history v4 only supports one blocker at a time: a new `history.block()` call
 * replaces the previous blocker. This patches `history.block()` so that any
 * number of blockers can coexist.
 * See https://github.com/meta/docusaurus/issues/10988
 */
export function enableMultipleBlockers(history: History): History {
  const historyBlock = history.block;
  let historyUnblock: (() => void) | undefined;

  // The most recently registered blocker comes first
  let blockers: TransitionPromptHook[] = [];

  function addBlocker(blocker: TransitionPromptHook) {
    blockers = [blocker, ...blockers];
    historyUnblock ??= historyBlock((location, action) =>
      runBlockers(blockers, location, action),
    );
  }

  function removeBlocker(blocker: TransitionPromptHook) {
    blockers = blockers.filter((b) => b !== blocker);
    if (blockers.length === 0) {
      historyUnblock?.();
      historyUnblock = undefined;
    }
  }

  history.block = (prompt) => {
    const blocker = toBlocker(prompt);
    addBlocker(blocker);
    return () => removeBlocker(blocker);
  };

  return history;
}

/**
 * Runs the blockers in order, until one cancels the transition (`false`) or
 * asks the user to confirm it (a prompt message).
 */
function runBlockers(
  blockers: TransitionPromptHook[],
  location: Location,
  action: Action,
): BlockerResult {
  for (const blocker of blockers) {
    const result = blocker(location, action);
    if (result === false || typeof result === 'string') {
      return result;
    }
  }
  return undefined;
}

function toBlocker(prompt: Prompt = false): TransitionPromptHook {
  if (typeof prompt === 'function') {
    // A new function for each call: the same prompt can be registered twice
    return (location, action) => prompt(location, action);
  }
  // Same as history v4: false always blocks, a string always asks to confirm
  return () => (prompt === true ? undefined : prompt);
}
